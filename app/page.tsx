import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import { About, Building, Stats, Contact, Faq, Footer, Manifesto, Principles, Writing } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Header />
      <main id="top">
        <Hero />
        <Stats />
        <About />
        <Manifesto />
        <Building />
        <Journey />
        <Principles />
        <Writing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
