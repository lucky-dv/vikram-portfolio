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

const dev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy. Next.js inlines bootstrap scripts and styles, so 'unsafe-inline' stays
 * for those (a nonce would make every page dynamic). Everything else is locked to this origin,
 * plus Supabase storage for article images.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const siteHost = new URL(siteUrl).hostname;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  // Separate dirs so `next build` never clobbers a running `next dev`.
  distDir: dev ? ".next-dev" : ".next",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Once a custom domain is the production domain, send production traffic that arrives on a
    // *.vercel.app address there (301), so search engines don't index two copies of the site.
    // Inactive while the vercel.app address is itself the canonical one, and on preview deploys.
    if (process.env.VERCEL_ENV !== "production" || siteHost.endsWith(".vercel.app") || siteHost === "localhost") return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<sub>.+)\\.vercel\\.app" }],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
