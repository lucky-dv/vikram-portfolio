import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { keywords, site } from "@/lib/content";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Founder of datavruti, estana & graph | Data, AI & Analytics Talent`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Business",
  alternates: { canonical: "/", types: { "text/plain": [{ url: "/llms.txt", title: "llms.txt" }] } },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: `${site.name}: ${site.tagline}`,
    description: "Co-founder of datavruti (datavruti.com), building estana (estana.in) and graph (mygraph.id): talent infrastructure for data, AI and analytics.",
    type: "profile",
    firstName: "Vikram",
    lastName: "Parekh",
    url: site.url,
    siteName: site.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: "Co-founder of datavruti, building estana and graph: talent infrastructure for data, AI and analytics.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad",
    "geo.position": "23.0225;72.5714",
    ICBM: "23.0225, 72.5714",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F2EC",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <link rel="me" href={site.linkedin} />
        {/* Scroll reveals start hidden and are animated in by JS; without JS, just show everything. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
