import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
