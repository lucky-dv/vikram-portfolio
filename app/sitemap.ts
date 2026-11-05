import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const latest = posts.reduce<Date>((d, p) => (p.updatedAt > d ? p.updatedAt : d), new Date("2026-11-01"));
  return [
    { url: `${site.url}/`, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/writing`, lastModified: latest, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/faq`, lastModified: latest, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((p) => ({
      url: `${site.url}/writing/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(p.coverImage ? { images: [p.coverImage] } : {}),
    })),
    { url: `${site.url}/llms.txt`, lastModified: latest, changeFrequency: "weekly", priority: 0.3 },
    { url: `${site.url}/llms-full.txt`, lastModified: latest, changeFrequency: "weekly", priority: 0.3 },
  ];
}
