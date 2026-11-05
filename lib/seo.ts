import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { autoExcerpt, textFromHtml } from "./sanitize";

export const SEO_TITLE_MAX = 60;
export const SEO_DESC_MAX = 155;

export type SeoResult = { seoTitle: string; seoDescription: string; source: "ai" | "rules" };
type Input = { title: string; excerpt?: string | null; content: string };

const SeoSchema = z.object({
  seoTitle: z.string().describe(`Search result title, at most ${SEO_TITLE_MAX} characters`),
  seoDescription: z.string().describe(`Meta description, 120-${SEO_DESC_MAX} characters`),
});

const SYSTEM = `You write search metadata for essays on vikramparekh.com, the personal site of Vikram Parekh, co-founder of datavruti (data, AI & analytics recruitment), building estana (an AI-native OS for recruitment agencies) and graph (career profiles for data professionals).

Return an SEO title and a meta description for the essay you are given.

SEO title:
- At most ${SEO_TITLE_MAX} characters. Put the main topic in the first few words.
- Specific and plain. Keep the essay's own voice; reuse its title when it already fits.
- No site name, no brand suffix, no quotation marks, no clickbait, no emoji, no trailing period.

Meta description:
- Between 120 and ${SEO_DESC_MAX} characters, one or two sentences, active voice.
- Say what the reader learns or gets from the essay, using its concrete specifics.
- Don't start with "In this article", "This post" or "Learn". No quotation marks, no emoji.

Write only what the essay supports. Don't invent numbers, names or claims.`;

let client: Anthropic | null = null;
function anthropic() {
  // Fail fast so publishing is never held up for long; rules-based fallback covers errors.
  client ??= new Anthropic({ timeout: 25_000, maxRetries: 1 });
  return client;
}

const DANGLING = /\s+(?:a|an|the|of|to|in|on|at|by|for|from|with|about|and|or|but|as|into|over|your|our|my|is|are|was|that|how|why|what)$/i;

/** Trim to `max` characters at a word boundary, without a dangling separator or connector word. */
function clamp(text: string, max: number) {
  const t = text.replace(/\s+/g, " ").replace(/^["'“”]+|["'“”]+$/g, "").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max + 1);
  const at = cut.lastIndexOf(" ");
  let out = (at > max * 0.6 ? cut.slice(0, at) : t.slice(0, max)).replace(/[\s,;:–—-]+$/, "");
  while (DANGLING.test(out)) out = out.replace(DANGLING, "");
  return out;
}

/** Fit a description: end on a full sentence when one fits, otherwise trim and add an ellipsis. */
function fitDescription(text: string, max: number) {
  const t = text.replace(/\s+/g, " ").replace(/…$/, "").trim();
  if (t.length <= max) return t;
  const window = t.slice(0, max);
  const end = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
  if (end >= 90) return window.slice(0, end + 1);
  return clamp(t, max - 1).replace(/[.,;:]$/, "") + "…";
}

/** Deterministic fallback: no network, always available. */
export function rulesSeo({ title, excerpt, content }: Input): SeoResult {
  const desc = excerpt?.trim() || autoExcerpt(content, SEO_DESC_MAX + 60);
  return {
    seoTitle: clamp(title, SEO_TITLE_MAX),
    seoDescription: fitDescription(desc, SEO_DESC_MAX),
    source: "rules",
  };
}

/** Claude-written SEO title + meta description, falling back to rules on any problem. */
export async function generateSeo(input: Input): Promise<SeoResult> {
  const body = textFromHtml(input.content);
  if (!process.env.ANTHROPIC_API_KEY || !input.title.trim() || !body) return rulesSeo(input);

  try {
    const response = await anthropic().beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(SeoSchema) },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `<title>${input.title}</title>\n<summary>${input.excerpt ?? ""}</summary>\n<essay>\n${body}\n</essay>`,
        },
      ],
    });

    const out = response.stop_reason === "refusal" ? null : response.parsed_output;
    if (!out?.seoTitle || !out?.seoDescription) return rulesSeo(input);
    return {
      seoTitle: clamp(out.seoTitle, SEO_TITLE_MAX),
      seoDescription: fitDescription(out.seoDescription, SEO_DESC_MAX),
      source: "ai",
    };
  } catch (e) {
    if (e instanceof Anthropic.APIError) console.error(`[seo] Claude API ${e.status}:`, e.message);
    else console.error("[seo] generation failed", e);
    return rulesSeo(input);
  }
}
