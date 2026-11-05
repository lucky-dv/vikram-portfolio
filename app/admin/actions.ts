"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BUCKET, isStorageUrl, ownPath, postImageUrls, supabaseAdmin } from "@/lib/supabase";
import { autoExcerpt, readingMinutes, sanitizeArticle } from "@/lib/sanitize";
import { generateSeo, type SeoResult } from "@/lib/seo";
import { audienceKeys } from "@/lib/content";

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
  coverImage: z
    .string()
    .refine(isStorageUrl, "Upload the cover image from the editor.")
    .optional()
    .or(z.literal("")),
  coverAlt: z.string().trim().max(200).optional(),
  coverPosition: z.string().max(40).default("center center"),
  coverHeight: z.number().int().min(200).max(720).default(640),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
  seoAuto: z.boolean().default(true),
  featured: z.boolean().default(false),
  audiences: z.array(z.enum(audienceKeys as [string, ...string[]])).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Publish date: use a valid date")
    .optional()
    .or(z.literal("")), // yyyy-mm-dd override, in IST
});

/** Calendar day in IST (what the site shows), as yyyy-mm-dd. */
const istDay = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/**
 * Delete storage images that a post no longer uses, unless another post still references them
 * (an image URL can be copied between posts). Best effort: never fails the save.
 */
async function pruneImages(urls: string[], keepFor?: string) {
  const own = urls.filter((u) => ownPath(u));
  if (!own.length) return;
  try {
    const others = await prisma.post.findMany({
      where: keepFor ? { id: { not: keepFor } } : undefined,
      select: { coverImage: true, content: true },
    });
    const used = new Set(others.flatMap(postImageUrls));
    const paths = own.filter((u) => !used.has(u)).map(ownPath).filter((p): p is string => !!p);
    if (paths.length) await supabaseAdmin().storage.from(BUCKET).remove(paths);
  } catch (e) {
    console.error("[images] prune failed", e);
  }
}

export type PostInput = z.input<typeof schema>;
type Result =
  | { ok: true; id: string; slug: string; seoTitle: string | null; seoDescription: string | null; seoAuto: boolean }
  | { ok: false; error: string };

type PostData = {
  title: string; excerpt: string; content: string; status: "DRAFT" | "PUBLISHED";
  seoAuto: boolean; seoTitle: string | null; seoDescription: string | null;
};

/**
 * Fill SEO fields automatically when they're in auto mode and the post is going live.
 * Regenerates only when something that feeds them changed, so repeated saves cost nothing.
 */
async function withAutoSeo<T extends PostData>(
  data: T,
  current?: { title: string; excerpt: string | null; content: string; seoTitle: string | null; seoDescription: string | null } | null
): Promise<T> {
  if (!data.seoAuto || data.status !== "PUBLISHED") return data;
  const unchanged =
    current && current.seoTitle && current.seoDescription &&
    current.title === data.title && (current.excerpt ?? "") === data.excerpt && current.content === data.content;
  if (unchanged) return { ...data, seoTitle: current!.seoTitle, seoDescription: current!.seoDescription };
  const seo = await generateSeo({ title: data.title, excerpt: data.excerpt, content: data.content });
  return { ...data, seoTitle: seo.seoTitle, seoDescription: seo.seoDescription };
}

const ok = (p: { id: string; slug: string; seoTitle: string | null; seoDescription: string | null; seoAuto: boolean }): Result => ({
  ok: true, id: p.id, slug: p.slug, seoTitle: p.seoTitle, seoDescription: p.seoDescription, seoAuto: p.seoAuto,
});

/** "Generate" button in the editor: preview fresh SEO fields without saving. */
export async function suggestSeo(input: { title: string; excerpt?: string; content: string }): Promise<SeoResult | { error: string }> {
  await assertAdmin();
  if (!input.title.trim()) return { error: "Add a title first." };
  const content = sanitizeArticle(input.content || "");
  if (!content.replace(/<[^>]+>/g, "").trim()) return { error: "Write the article first." };
  return generateSeo({ title: input.title.trim(), excerpt: input.excerpt?.trim() || autoExcerpt(content), content });
}

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
      seoAuto: d.seoAuto,
      featured: d.featured,
      audiences: Array.from(new Set(d.audiences)),
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

  const data = await withAutoSeo(n.data);
  const post = await prisma.post.create({
    data: {
      ...data,
      editorEmail: user.email ?? null,
      publishedAt: n.data.status === "PUBLISHED" ? n.publishedAtOverride ?? new Date() : null,
    },
  });
  revalidateAll(post.slug);
  return ok(post);
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
  // Compared as IST calendar days: that's what the form shows and what the site prints.
  const sameDay = n.publishedAtOverride && current.publishedAt && input.publishedAt === istDay(current.publishedAt);
  const override = sameDay ? undefined : n.publishedAtOverride;
  const publishedAt =
    n.data.status === "PUBLISHED"
      ? override ?? current.publishedAt ?? new Date()
      : current.publishedAt; // keep the original date if it's unpublished and re-published later

  // A post that has ever been live keeps its old URLs so they can 301 to the new one.
  const slugChanged = current.slug !== n.data.slug;
  const previousSlugs = [
    ...new Set([...current.previousSlugs, ...(slugChanged && current.publishedAt ? [current.slug] : [])]),
  ].filter((s) => s !== n.data.slug);

  const data = await withAutoSeo(n.data, current);
  const post = await prisma.post.update({ where: { id }, data: { ...data, publishedAt, previousSlugs } });
  revalidateAll(post.slug);
  if (slugChanged) revalidatePath(`/writing/${current.slug}`);

  // Images dropped by this save (replaced cover, deleted inline image) are removed from storage.
  const kept = new Set(postImageUrls(post));
  await pruneImages(postImageUrls(current).filter((u) => !kept.has(u)), id);
  return ok(post);
}

export async function setPostStatus(id: string, status: "DRAFT" | "PUBLISHED") {
  await assertAdmin();
  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) return { ok: false as const, error: "Post not found." };
  // Publishing from the list: fill auto SEO fields if they're still empty.
  const seo =
    status === "PUBLISHED" && current.seoAuto && (!current.seoTitle || !current.seoDescription)
      ? await generateSeo({ title: current.title, excerpt: current.excerpt, content: current.content })
      : null;
  const post = await prisma.post.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? current.publishedAt ?? new Date() : current.publishedAt,
      ...(seo ? { seoTitle: seo.seoTitle, seoDescription: seo.seoDescription } : {}),
    },
  });
  revalidateAll(post.slug);
  return { ok: true as const };
}

export async function deletePost(id: string) {
  await assertAdmin();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { ok: false as const, error: "Post not found." };
  await prisma.post.delete({ where: { id } });
  // Remove this post's images from storage (cover + inline) unless another post uses them.
  await pruneImages(postImageUrls(post), id);
  revalidateAll(post.slug);
  return { ok: true as const };
}
