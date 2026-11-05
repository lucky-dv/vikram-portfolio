"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const onHome = pathname === "/";
  // On articles, get out of the reader's way: hide on scroll down, reveal on any scroll up.
  const autoHide = pathname.startsWith("/writing/");
  const hrefFor = (h: string) => (onHome ? h : h === "#writing" ? "/writing" : `/${h}`);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    let lastY = window.scrollY;
    let travelled = 0; // distance moved in the current direction, to ignore tiny jitters
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (!autoHide) return setHidden(false);
      const dy = y - lastY;
      travelled = Math.sign(dy) === Math.sign(travelled) ? travelled + dy : dy;
      lastY = y;
      if (y < 120) setHidden(false); // always visible near the top
      else if (travelled > 12) setHidden(true); // scrolling down
      else if (travelled < -6) setHidden(false); // any deliberate scroll up
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [autoHide]);

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;

    // Modal behaviour: focus moves into the menu, Tab cycles between the toggle and the menu
    // links (never the page hidden behind it), Escape closes and hands focus back to the toggle.
    const focusables = () => [
      toggleRef.current,
      ...Array.from(document.querySelectorAll<HTMLElement>("#mobile-menu a")),
    ].filter((el): el is HTMLElement => !!el);
    const first = window.setTimeout(() => focusables()[1]?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      const i = els.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : i === els.length - 1 ? 0 : i + 1;
      e.preventDefault();
      els[next]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(first);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  return (
    <>
      <header
        className={`site-header${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}`}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="wrap">
          <a className="brand" href={onHome ? "#top" : "/"} aria-label={`${site.name}, back to top`}>
            Vikram <em>Parekh</em>
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {/* Contact is the button on the right, so it isn't repeated as a link here. */}
              {nav.filter((n) => n.href !== "#contact").map((n) => (
                <li key={n.href}>
                  <a href={hrefFor(n.href)} className={onHome && active === n.href.slice(1) ? "is-active" : undefined}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn-sm header-cta" href={hrefFor("#contact")}>
            Contact <span className="arrow" aria-hidden="true">→</span>
          </a>
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`burger${open ? " is-open" : ""}`} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
        <motion.div className="progress" style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul>
              {nav.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={hrefFor(n.href)}
                    onClick={(e) => {
                      if (!onHome) { setOpen(false); return; }
                      e.preventDefault();
                      setOpen(false);
                      document.documentElement.style.overflow = "";
                      if (lenis) {
                        lenis.start();
                        lenis.scrollTo(n.href);
                      } else {
                        document.querySelector(n.href)?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <span className="sheet-n">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="sheet-foot">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.phoneHref}>{site.phone}</a>
              <span>{site.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
