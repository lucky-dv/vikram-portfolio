"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const onHome = usePathname() === "/";
  const hrefFor = (h: string) => (onHome ? h : h === "#writing" ? "/writing" : `/${h}`);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap">
          <a className="brand" href={onHome ? "#top" : "/"} aria-label={`${site.name}, back to top`}>
            Vikram <em>Parekh</em>
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={hrefFor(n.href)} className={onHome && active === n.href.slice(1) ? "is-active" : undefined}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn-sm header-cta" href={site.linkedin} target="_blank" rel="me noopener">
            Connect <span className="arrow" aria-hidden="true">→</span>
          </a>
          <button
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
              <span>{site.location}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
