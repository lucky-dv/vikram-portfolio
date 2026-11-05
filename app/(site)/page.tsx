import Hero from "@/components/Hero";
import EarlyCareer from "@/components/EarlyCareer";
import Journey from "@/components/Journey";
import { About, Building, Contact, Manifesto, Principles, Stats, Writing } from "@/components/Sections";
import { getWritingFeed } from "@/lib/posts";
import { buildJsonLd } from "@/lib/schema";

// Re-generated in the background; publishing from /admin also revalidates instantly.
export const revalidate = 3600;

export default async function Home() {
  const all = await getWritingFeed();
  const feed = all.slice(0, 5);
  return (
    <main id="top">
      {/* Homepage-only structured data: the profile it describes is on this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(all)).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <span id="content" tabIndex={-1} />
      <Stats />
      <About />
      <Manifesto />
      <Building />
      <Journey />
      <Principles />
      <Writing items={feed} />
      <EarlyCareer />
      <Contact />
    </main>
  );
}
