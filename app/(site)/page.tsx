import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import { About, Building, Contact, Faq, Manifesto, Principles, Stats, Writing } from "@/components/Sections";
import { getWritingFeed } from "@/lib/posts";

// Re-generated in the background; publishing from /admin also revalidates instantly.
export const revalidate = 3600;

export default async function Home() {
  const feed = (await getWritingFeed()).slice(0, 5);
  return (
    <main id="top">
      <Hero />
      <span id="content" />
      <Stats />
      <About />
      <Manifesto />
      <Building />
      <Journey />
      <Principles />
      <Writing items={feed} />
      <Faq />
      <Contact />
    </main>
  );
}
