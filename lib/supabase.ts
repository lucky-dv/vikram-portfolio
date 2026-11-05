import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Shares datavruti's public "blog-images" bucket; everything we write lives under PREFIX. */
export const BUCKET = process.env.SUPABASE_BUCKET || "blog-images";
export const PREFIX = "portfolio/";

/** Storage path for a public URL, only if it belongs to this site's folder (never touch datavruti's images). */
export function ownPath(url?: string | null) {
  const path = url?.split(`/${BUCKET}/`)[1]?.split("?")[0];
  return path && path.startsWith(PREFIX) && !path.includes("..") ? path : null;
}

/** Every image URL a post uses: the cover plus inline <img> tags. */
export function postImageUrls(p: { coverImage?: string | null; content: string }) {
  const inline = Array.from(p.content.matchAll(/<img[^>]+src="([^"]+)"/g), (m) => m[1]);
  return [...new Set([p.coverImage, ...inline].filter((u): u is string => !!u))];
}

/** Public Supabase storage URL (the only image host next/image is configured for). */
export function isStorageUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".supabase.co") && u.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

let client: SupabaseClient | null = null;

/** Service-role client for server-side uploads. Never import this from client code. */
export function supabaseAdmin() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
