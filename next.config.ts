import type { NextConfig } from "next";

/**
 * Canonical site URL. Priority:
 *  1. NEXT_PUBLIC_SITE_URL (explicit override)
 *  2. Vercel's production domain: the .vercel.app address today, the custom domain
 *     (vikramparekh.com) automatically once it's connected in Vercel
 *  3. localhost in dev
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  // Separate dirs so `next build` never clobbers a running `next dev`.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
