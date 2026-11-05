import { journey, keywords, site, ventureEntities, ventures } from "./content";
import type { PostCard } from "./posts";

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;
const PAGE_ID = `${site.url}/#profilepage`;

/**
 * Homepage JSON-LD only (ProfilePage describes content that's on "/"; FAQPage lives on /faq): one connected @graph. Every entity has a stable @id so search engines
 * and LLM crawlers can resolve Vikram ↔ datavruti ↔ estana ↔ graph as linked entities.
 */
export function buildJsonLd(feed: PostCard[]) {
  const abs = (href: string) => (href.startsWith("/") ? `${site.url}${href}` : href);
  const posts = feed.map((p) => ({ ...p, href: abs(p.href) }));
  const ventureNodes = ventures.map((v) => {
    const e = ventureEntities[v.name as keyof typeof ventureEntities];
    const isSoftware = v.name !== "datavruti";
    return {
      "@type": isSoftware ? ["Organization", "Brand"] : "Organization",
      "@id": e.id,
      name: v.name,
      ...(e.legalName ? { legalName: e.legalName } : {}),
      url: v.url,
      description: e.summary,
      slogan: v.audience,
      founder: { "@id": PERSON_ID },
      knowsAbout: ["Data, AI & analytics talent", e.category],
      ...(v.name === "datavruti"
        ? {
            sameAs: ["https://in.linkedin.com/company/datavruti"],
            address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
            areaServed: ["IN", "Worldwide"],
          }
        : {}),
    };
  });

  const softwareApps = ventures
    .filter((v) => v.name !== "datavruti")
    .map((v) => ({
      "@type": "SoftwareApplication",
      "@id": `${v.url}/#app`,
      name: v.name,
      url: v.url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: ventureEntities[v.name as keyof typeof ventureEntities].summary,
      publisher: { "@id": ventureEntities[v.name as keyof typeof ventureEntities].id },
      creator: { "@id": PERSON_ID },
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: site.name,
        givenName: "Vikram",
        familyName: "Parekh",
        url: `${site.url}/`,
        image: { "@type": "ImageObject", url: `${site.url}/vikram-profile.png`, width: 1122, height: 1402, caption: site.name },
        jobTitle: "Co-founder",
        description: site.description,
        email: `mailto:${site.email}`,
        telephone: site.phone,
        nationality: { "@type": "Country", name: "India" },
        homeLocation: { "@type": "Place", name: "Ahmedabad, Gujarat, India" },
        address: { "@type": "PostalAddress", addressLocality: "Ahmedabad", addressRegion: "Gujarat", addressCountry: "IN" },
        worksFor: ventures.map((v) => ({ "@id": ventureEntities[v.name as keyof typeof ventureEntities].id })),
        sameAs: [site.linkedin],
        knowsAbout: [
          "Data engineering recruitment",
          "Data science hiring",
          "AI talent acquisition",
          "Analytics hiring",
          "Recruitment process outsourcing (RPO)",
          "Recruitment agency software",
          "Recruitment business metrics",
          "Net fee income",
        ],
        hasOccupation: {
          "@type": "Occupation",
          name: "Founder",
          occupationLocation: { "@type": "City", name: "Ahmedabad" },
        },
        subjectOf: posts.map((p) => ({ "@id": `${p.href}#article` })),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${site.url}/`,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
        keywords: keywords.join(", "),
      },
      {
        "@type": "ProfilePage",
        "@id": PAGE_ID,
        url: `${site.url}/`,
        name: `${site.name}: ${site.tagline}`,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
        inLanguage: "en",
        dateModified: new Date().toISOString().slice(0, 10),
        significantLink: ventures.map((v) => v.url),
        speakable: { "@type": "SpeakableSpecification", cssSelector: [".lede", "#about .prose"] },
      },
      ...ventureNodes,
      ...softwareApps,
      {
        "@type": "ItemList",
        "@id": `${site.url}/#ventures`,
        name: "Companies and products built by Vikram Parekh",
        itemListElement: ventures.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: v.url,
          name: v.name,
          item: { "@id": ventureEntities[v.name as keyof typeof ventureEntities].id },
        })),
      },
      ...posts.map((p) => ({
        "@type": "BlogPosting",
        "@id": `${p.href}#article`,
        headline: p.title,
        description: p.excerpt,
        url: p.href,
        datePublished: p.date,
        author: { "@id": PERSON_ID },
        // Essays on datavruti.com are published by datavruti; the ones here by Vikram himself.
        publisher: { "@id": p.external ? ventureEntities.datavruti.id : PERSON_ID },
        inLanguage: "en",
      })),
      {
        "@type": "ItemList",
        "@id": `${site.url}/#journey`,
        name: "Vikram Parekh career timeline",
        itemListElement: journey.map((j, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${j.year}: ${j.title}`,
          description: j.text,
        })),
      },
    ],
  };
}
