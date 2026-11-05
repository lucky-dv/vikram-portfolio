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
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//.test(href) && !OWN_HOSTS.some((h) => href.includes(h));
        return {
          tagName,
          attribs: { ...attribs, ...(external ? { target: "_blank", rel: "noopener" } : {}) },
        };
      },
    },
  });
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
