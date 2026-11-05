"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BUCKET, ownPath, supabaseAdmin } from "@/lib/supabase";
import { autoExcerpt, readingMinutes, sanitizeArticle } from "@/lib/sanitize";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and single hyphens only"),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().min(1, "Write something first"),
  coverImage: z.string().url().optional().or(z.literal("")),
  coverAlt: z.string().trim().max(200).optional(),
  coverPosition: z.string().max(40).default("center center"),
  coverHeight: z.number().int().min(200).max(720).default(420),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  publishedAt: z.string().optional(), // yyyy-mm-dd override
});

export type PostInput = z.input<typeof schema>;
type Result = { ok: true; id: string; slug: string } | { ok: false; error: string };

function revalidateAll(slug?: string) {
  revalidatePath("/");
  revalidatePath("/writing");
  if (slug) revalidatePath(`/writing/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
  revalidatePath("/admin/posts");
}

function normalise(input: PostInput) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" } as const;
  const d = parsed.data;
  const content = sanitizeArticle(d.content);
  if (!content.replace(/<[^>]+>/g, "").trim() && !content.includes("<img")) return { error: "Write something first" } as const;
  return {
    data: {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt || autoExcerpt(content),
      content,
      coverImage: d.coverImage || null,
      coverAlt: d.coverAlt || null,
      coverPosition: d.coverPosition,
      coverHeight: d.coverHeight,
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
      featured: d.featured,
      status: d.status,
      readingMinutes: readingMinutes(content),
    },
    publishedAtOverride: d.publishedAt ? new Date(`${d.publishedAt}T09:00:00+05:30`) : undefined,
  } as const;
}

export async function createPost(input: PostInput): Promise<Result> {
  const user = await assertAdmin();
  const n = normalise(input);
  if ("error" in n) return { ok: false, error: n.error! };
  if (await prisma.post.findUnique({ where: { slug: n.data.slug } }))
    return { ok: false, error: "Another post already uses this slug." };

  const post = await prisma.post.create({
    data: {
      ...n.data,
      editorEmail: user.email ?? null,
      publishedAt: n.data.status === "PUBLISHED" ? n.publishedAtOverride ?? new Date() : null,
    },
  });
  revalidateAll(post.slug);
  return { ok: true, id: post.id, slug: post.slug };
}

export async function updatePost(id: string, input: PostInput): Promise<Result> {
  await assertAdmin();
  const n = normalise(input);
  if ("error" in n) return { ok: false, error: n.error! };
  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) return { ok: false, error: "Post not found." };
  const clash = await prisma.post.findUnique({ where: { slug: n.data.slug } });
  if (clash && clash.id !== id) return { ok: false, error: "Another post already uses this slug." };

  // Only honour the date field when it actually changed (it is pre-filled with the current date).
  const sameDay =
    n.publishedAtOverride && current.publishedAt &&
    n.publishedAtOverride.toISOString().slice(0, 10) === current.publishedAt.toISOString().slice(0, 10);
  const override = sameDay ? undefined : n.publishedAtOverride;
  const publishedAt =
    n.data.status === "PUBLISHED"
      ? override ?? current.publishedAt ?? new Date()
      : current.publishedAt; // keep the original date if it's unpublished and re-published later

  const post = await prisma.post.update({ where: { id }, data: { ...n.data, publishedAt } });
  revalidateAll(post.slug);
  if (current.slug !== post.slug) revalidatePath(`/writing/${current.slug}`);
  return { ok: true, id: post.id, slug: post.slug };
}

export async function setPostStatus(id: string, status: "DRAFT" | "PUBLISHED") {
  await assertAdmin();
  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) return { ok: false as const, error: "Post not found." };
  const post = await prisma.post.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" ? current.publishedAt ?? new Date() : current.publishedAt },
  });
  revalidateAll(post.slug);
  return { ok: true as const };
}

export async function deletePost(id: string) {
  await assertAdmin();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { ok: false as const, error: "Post not found." };
  await prisma.post.delete({ where: { id } });
  // Remove this post's images from storage (cover + inline), best effort.
  const urls = [post.coverImage, ...Array.from(post.content.matchAll(/<img[^>]+src="([^"]+)"/g), (m) => m[1])];
  const paths = urls.map(ownPath).filter((p): p is string => !!p);
  if (paths.length) await supabaseAdmin().storage.from(BUCKET).remove(paths).catch(() => {});
  revalidateAll(post.slug);
  return { ok: true as const };
}
