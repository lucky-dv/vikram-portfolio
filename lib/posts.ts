import "server-only";
import { cache } from "react";
import { posts as externalPosts } from "./content";
import { prisma } from "./prisma";

export type PostCard = {
  title: string;
  excerpt: string;
  href: string;
  date: string; // ISO yyyy-mm-dd
  label: string; // "7 Jul 2026"
  external: boolean;
  source?: string;
  coverImage?: string | null;
  readingMinutes?: number;
};

const hasDb = () => !!process.env.DATABASE_URL;

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

/** Published posts, newest first. Returns [] if the DB isn't configured or reachable, so the site never breaks. */
export const getPublishedPosts = cache(async () => {
  if (!hasDb()) return [];
  try {
    return await prisma.post.findMany({
      where: { status: "PUBLISHED", publishedAt: { not: null } },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      select: {
        id: true, title: true, slug: true, excerpt: true, coverImage: true, coverAlt: true,
        readingMinutes: true, publishedAt: true, updatedAt: true, featured: true,
      },
    });
  } catch (e) {
    console.error("[posts] failed to load published posts", e);
    return [];
  }
});

export const getPublishedPost = cache(async (slug: string) => {
  if (!hasDb()) return null;
  try {
    return await prisma.post.findFirst({ where: { slug, status: "PUBLISHED" } });
  } catch (e) {
    console.error("[posts] failed to load post", slug, e);
    return null;
  }
});

/** Own posts + essays published on datavruti.com, merged by date. */
export async function getWritingFeed(): Promise<PostCard[]> {
  const own = (await getPublishedPosts()).map<PostCard>((p) => ({
    title: p.title,
    excerpt: p.excerpt ?? "",
    href: `/writing/${p.slug}`,
    date: p.publishedAt!.toISOString().slice(0, 10),
    label: fmtDate(p.publishedAt!),
    external: false,
    coverImage: p.coverImage,
    readingMinutes: p.readingMinutes,
  }));
  const ext = externalPosts.map<PostCard>((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    href: p.href,
    date: p.date,
    label: p.label,
    external: true,
    source: "datavruti.com",
  }));
  return [...own, ...ext].sort((a, b) => (a.date < b.date ? 1 : -1));
}
