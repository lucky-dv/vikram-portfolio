import type { Metadata } from "next";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import { Footer } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Lives at the app root so it also catches URLs outside every route group. That means it
 * renders inside the root layout only, so it brings the site chrome (header, footer) itself.
 */
export default function NotFound() {
  return (
    <SmoothScroll>
      <Header />
      <main id="top" className="page">
        <section className="page-hero not-found">
          <div className="wrap rise">
            <p className="label">404</p>
            <h1 className="page-title">
              This page <em>isn&rsquo;t here</em>
            </h1>
            <p className="lede">The link may be old, or the address mistyped. These will get you back on track.</p>
            <div className="hero-links">
              <a className="btn" href="/">
                Go to the homepage <span className="arrow" aria-hidden="true">→</span>
              </a>
              <a className="plain" href="/writing">
                Read the writing <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
