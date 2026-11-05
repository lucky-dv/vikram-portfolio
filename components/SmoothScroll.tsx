"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The tree stays the same either way; only Lenis' options change. (Swapping ReactLenis in and
  // out remounted the whole page right after hydration for reduced-motion users.) Lenis rebuilds
  // its instance when options change. Its own `anchors` handling is off: it scrolls but lets the
  // browser write "#section" into the address bar, so CleanAnchors does that job instead.
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={reduced ? { smoothWheel: false, syncTouch: false } : { lerp: 0.09, wheelMultiplier: 1 }}
      >
        <CleanAnchors immediate={reduced} />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}

const strip = () => {
  if (window.location.hash) history.replaceState(history.state, "", window.location.pathname + window.location.search);
};

/**
 * In-page links (#about, #writing, …) scroll to their section without putting "#about" in the URL.
 * Links from other pages ("/#about") still need the hash to say where to land; it's removed once
 * the page has scrolled there. Offsets come from html { scroll-padding-top } (header height).
 */
function CleanAnchors({ immediate }: { immediate: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const el = document.getElementById(id);
      if (!el && id !== "top") return; // unknown target: leave it to the browser

      e.preventDefault();
      if (lenis) lenis.scrollTo(id === "top" ? 0 : `#${CSS.escape(id)}`, { immediate });
      else if (el) el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
      else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
      // Keep what a real anchor jump does for keyboard users (e.g. the skip link): move focus there.
      if (el?.hasAttribute("tabindex")) el.focus({ preventScroll: true });
      strip();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis, immediate]);

  // Arrived with a hash (e.g. "/#about" from an article). Wait until Lenis exists and web fonts
  // have settled the layout, land on the section exactly as a click would, then tidy the URL.
  // Lenis is rebuilt when its options change (e.g. reduced motion detected after mount), so the
  // deferred scroll reads whichever instance is current at that moment.
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current || !lenis) return;
    arrived.current = true;
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    document.fonts.ready.then(() =>
      requestAnimationFrame(() => {
        if (document.getElementById(id)) lenisRef.current?.scrollTo(`#${CSS.escape(id)}`, { immediate: true, force: true });
        strip();
      })
    );
  }, [lenis]);

  return null;
}
