import sanitizeHtml from "sanitize-html";

const OWN_HOSTS = ["vikramparekh.com", (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/^https?:\/\//, "")].filter(Boolean);

/** Server-side allow-list for article HTML coming from the editor. */
export function sanitizeArticle(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4",
      "strong", "em", "u", "s", "code", "pre", "mark",
      "ul", "ol", "li", "blockquote", "hr",
      "a", "img", "figure", "figcaption",
    ],
    allowedAttributes: {
      "*": ["data-size", "data-align"],
      a: ["href", "rel", "target"],
      img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] }, // no mixed content
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = isExternal(href);
        const { target: _t, rel: _r, ...rest } = attribs; // decided here, never taken from pasted HTML
        return {
          tagName,
          attribs: { ...rest, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) },
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy", decoding: "async" },
      }),
    },
  });
}

/** Compare hostnames exactly, so "evil.com/?vikramparekh.com" is still treated as external. */
function isExternal(href: string) {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    return !OWN_HOSTS.some((h) => host === h.replace(/^www\./, "").split("/")[0]);
  } catch {
    return true;
  }
}

/**
 * Render-time touch-up for article HTML already stored in the database: makes inline images
 * lazy-load even for posts saved before the sanitiser started adding the attributes.
 */
export function renderArticle(html: string) {
  return html.replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
}

export function textFromHtml(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
}

export function readingMinutes(html: string) {
  const words = textFromHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export function autoExcerpt(html: string, max = 180) {
  const text = textFromHtml(html);
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).replace(/[,;:.\s]+$/, "") + "…";
}
