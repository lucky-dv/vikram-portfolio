import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

// Explicitly welcome search and AI answer-engine crawlers (GEO).
const aiBots = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "GoogleOther",
  "Applebot", "Applebot-Extended",
  "Bingbot", "DuckAssistBot", "CCBot", "Meta-ExternalAgent", "cohere-ai", "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
      { userAgent: aiBots, allow: "/", disallow: ["/admin", "/api/"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
