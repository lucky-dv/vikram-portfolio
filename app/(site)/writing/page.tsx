import type { Metadata } from "next";
import WritingFilter from "@/components/WritingFilter";
import { site } from "@/lib/content";
import { getWritingFeed } from "@/lib/posts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays by Vikram Parekh on hiring data, AI and analytics talent, running a recruitment business, recruiter productivity and building datavruti, estana and graph.",
  alternates: { canonical: "/writing" },
  openGraph: { title: `Writing · ${site.name}`, url: `${site.url}/writing`, type: "website" },
};

export default async function WritingIndex() {
  const items = await getWritingFeed();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}/writing#blog`,
    name: `Writing by ${site.name}`,
    url: `${site.url}/writing`,
    author: { "@id": `${site.url}/#person` },
    blogPost: items
      .filter((p) => !p.external)
      .map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${site.url}${p.href}`, datePublished: p.date })),
  };

  return (
    <main id="top" className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="page-hero">
        <div className="wrap">
          <div className="section-head rise">
            <p className="label">Writing</p>
            <h1 className="page-title">
              Notes on hiring, <em>and building</em>
            </h1>
            <p className="lede">
              On hiring data, AI and analytics talent, running a recruitment business, and what I learn building datavruti,
              estana and graph.
            </p>
          </div>
        </div>
      </section>
      <section className="block" id="content" tabIndex={-1} aria-label="All posts">
        <div className="wrap">
          {items.length ? <WritingFilter items={items} syncUrl /> : <p className="muted">Nothing published yet.</p>}
        </div>
      </section>
    </main>
  );
}
