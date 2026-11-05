import type { Metadata } from "next";
import { FaqList } from "@/components/Sections";
import { faqs, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Quick answers about Vikram Parekh and what he's building: datavruti, estana and graph, talent infrastructure for data, AI and analytics.",
  alternates: { canonical: "/faq" },
  openGraph: { title: `FAQ · ${site.name}`, url: `${site.url}/faq`, type: "website" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${site.url}/faq#faq`,
    url: `${site.url}/faq`,
    about: { "@id": `${site.url}/#person` },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main id="top" className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="page-hero">
        <div className="wrap">
          <div className="section-head rise">
            <p className="label">Quick answers</p>
            <h1 className="page-title">
              Frequently <em>asked</em>
            </h1>
            <p className="lede">The short version, for people and for the AI assistants that summarise this site.</p>
          </div>
        </div>
      </section>
      <section className="block" id="content" tabIndex={-1} aria-label="Questions and answers">
        <div className="wrap">
          <FaqList />
        </div>
      </section>
    </main>
  );
}
