"use client";

import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { earlyCareer } from "@/lib/content";
import Reveal from "./Reveal";

const ICONS: Record<string, React.ReactNode> = {
  arch: <><path d="M8 40 24 8l16 32Z" /><path d="M16 40 24 24l8 16" /><path d="M6 40h36" /></>,
  network: <><circle cx="24" cy="10" r="5" /><circle cx="10" cy="36" r="5" /><circle cx="38" cy="36" r="5" /><path d="M21.5 14.5 12.5 31.5M26.5 14.5l9 17M15 36h18" /></>,
  cap: <><path d="M4 18 24 9l20 9-20 9Z" /><path d="M12 22v11c0 3 6 6 12 6s12-3 12-6V22" /><path d="M44 18v12" /></>,
  db: <><ellipse cx="24" cy="11" rx="14" ry="5" /><path d="M10 11v26c0 2.8 6.3 5 14 5s14-2.2 14-5V11" /><path d="M10 24c0 2.8 6.3 5 14 5s14-2.2 14-5" /></>,
  audit: <><path d="M12 6h18l8 8v28H12Z" /><path d="M30 6v8h8" /><circle cx="23" cy="26" r="6" /><path d="m27.5 30.5 6 6" /></>,
  clipboard: <><rect x="10" y="8" width="28" height="34" rx="3" /><path d="M18 8V5h12v3" /><path d="m16 20 3 3 5-6M16 32l3 3 5-6M28 21h4M28 33h4" /></>,
  bank: <><path d="M6 18 24 8l18 10Z" /><path d="M10 22v14M19 22v14M29 22v14M38 22v14" /><path d="M6 40h36" /></>,
  rocket: <><path d="M24 4c7 5 10 13 8 23l-4 6h-8l-4-6c-2-10 1-18 8-23Z" /><circle cx="24" cy="17" r="3.5" /><path d="M16 27l-6 6 6 2M32 27l6 6-6 2M20 39l4 5 4-5" /></>,
  trophy: <><path d="M15 6h18v10a9 9 0 0 1-18 0Z" /><path d="M15 9H8c0 6 3 9 7 9.5M33 9h7c0 6-3 9-7 9.5" /><path d="M24 25v8M17 42h14l-2-9H19Z" /></>,
  devices: <><rect x="4" y="9" width="30" height="21" rx="2" /><path d="M12 38h14M19 30v8" /><rect x="30" y="18" width="14" height="24" rx="2.5" /><path d="M35 38h4" /></>,
  megaphone: <><path d="M8 20v8h6l14 9V11l-14 9Z" /><path d="M14 28l3 11h5l-2-10" /><path d="M34 18c2 1.5 3 3.5 3 6s-1 4.5-3 6M38 13c4 3 6 7 6 11s-2 8-6 11" /></>,
  flag: <><path d="M14 44V6" /><path d="M14 8h22l-5 7 5 7H14" /><path d="M6 44h36" /></>,
};

/** All stops in reading order, with their chapter, for the detail card's prev/next. */
const FLAT = earlyCareer.flatMap((ch, row) => ch.stops.map((s) => ({ ...s, chapter: ch, row })));

export default function EarlyCareer() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const track = useRef<SVGPathElement>(null);
  const done = useRef<SVGPathElement>(null);
  const start = useRef<SVGCircleElement>(null);
  const traveller = useRef<SVGCircleElement>(null);
  const geo = useRef<{ total: number; dotLen: number[]; firstY: number; lastY: number }>({ total: 0, dotLen: [], firstY: 0, lastY: 0 });

  const [live, setLive] = useState(false); // scroll-drawing active (JS on, motion allowed)
  const [lit, setLit] = useState(FLAT.length); // stops reached by the road
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const returnFocus = useRef<HTMLElement | null>(null);

  /* ---------- Road geometry + scroll drawing ---------- */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const narrow = window.matchMedia("(max-width: 760px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLive(!reduced);

    const draw = () => {
      const box = el.getBoundingClientRect();
      const W = box.width;
      svg.current?.setAttribute("viewBox", `0 0 ${W} ${box.height}`);
      const dots = [...el.querySelectorAll<HTMLElement>(".ec-dot")].map((d) => {
        const r = d.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top, row: Number(d.dataset.row) };
      });
      if (!dots.length || !track.current || !done.current || !start.current) return;
      let d: string;
      let sx: number, sy: number;
      if (narrow.matches) {
        sx = dots[0].x;
        sy = dots[0].y - 46;
        d = `M ${sx} ${sy} L ${sx} ${dots[dots.length - 1].y}`;
      } else {
        const bulge = 64, edgeR = W - 8 - bulge * 0.75, edgeL = 8 + bulge * 0.75;
        sx = 22;
        sy = dots[0].y;
        d = `M ${sx} ${sy}`;
        dots.forEach((p, i) => {
          d += ` L ${p.x} ${p.y}`;
          const n = dots[i + 1];
          if (n && n.row !== p.row) {
            const right = p.row % 2 === 0;
            const e = right ? edgeR : edgeL, c = right ? e + bulge : e - bulge;
            d += ` L ${e} ${p.y} C ${c} ${p.y} ${c} ${n.y} ${e} ${n.y}`;
          }
        });
      }
      start.current.setAttribute("cx", String(sx));
      start.current.setAttribute("cy", String(sy));
      track.current.setAttribute("d", d);
      done.current.setAttribute("d", d);

      // Length along the road at which each stop sits (nearest sampled point).
      const total = done.current.getTotalLength();
      const samples: { l: number; x: number; y: number }[] = [];
      for (let l = 0; l <= total; l += 6) {
        const pt = done.current.getPointAtLength(l);
        samples.push({ l, x: pt.x, y: pt.y });
      }
      const dotLen = dots.map((p) => {
        let best = 0, bd = Infinity;
        for (const s of samples) {
          const dd = (s.x - p.x) ** 2 + (s.y - p.y) ** 2;
          if (dd < bd) { bd = dd; best = s.l; }
        }
        return best;
      });
      geo.current = { total, dotLen, firstY: sy, lastY: dots[dots.length - 1].y };
      done.current.style.strokeDasharray = `${total}`;
      update();
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const g = geo.current;
      if (!g.total || !done.current) return;
      if (reduced) {
        done.current.style.strokeDashoffset = "0";
        setLit(FLAT.length);
        return;
      }
      // The road's tip follows a reading line 62% down the viewport.
      const box = el.getBoundingClientRect();
      const readY = window.innerHeight * 0.62 - box.top;
      const p = Math.min(1, Math.max(0, (readY - g.firstY) / Math.max(1, g.lastY - g.firstY)));
      const tip = p * g.total;
      done.current.style.strokeDashoffset = String(g.total - tip);
      if (traveller.current) {
        const pt = done.current.getPointAtLength(tip);
        traveller.current.setAttribute("cx", String(pt.x));
        traveller.current.setAttribute("cy", String(pt.y));
        traveller.current.style.opacity = p > 0 && p < 1 ? "1" : "0";
      }
      setLit(g.dotLen.filter((l) => l <= tip + 4).length);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    narrow.addEventListener("change", draw);
    document.fonts?.ready.then(draw);
    const t = window.setTimeout(draw, 1200); // after reveal animations settle
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      narrow.removeEventListener("change", draw);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------- Detail card ---------- */
  const close = useCallback(() => {
    setOpen(null);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : Math.min(FLAT.length - 1, i + 1)));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : Math.max(0, i - 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open, lenis, close]);

  const current = open === null ? null : FLAT[open];
  let flatIndex = -1;

  return (
    <section className="block" id="before" aria-labelledby="before-h">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="label">Before datavruti · 2000–2018</p>
          <h2 id="before-h">
            From architecture school to <em>founder</em>
          </h2>
          <p className="ec-hint">Scroll to follow the road. Tap any stop for the full story.</p>
        </Reveal>

        <div className={`ec${live ? " is-live" : ""}`} ref={wrap}>
          <svg className="ec-road" ref={svg} aria-hidden="true">
            <path className="ec-track" ref={track} d="" />
            <path className="ec-done" ref={done} d="" />
            <circle className="ec-start" ref={start} r="11" />
            {live && <circle className="ec-traveller" ref={traveller} r="7" />}
          </svg>

          {earlyCareer.map((ch, row) => (
            <ol key={ch.key} className={`ec-row${row % 2 ? " rev" : ""}`} style={{ ["--c" as string]: `var(--ec-${ch.key})` }}>
              <span className="ec-chapter" aria-hidden="true">{ch.label}</span>
              {ch.stops.map((s, i) => {
                flatIndex += 1;
                const idx = flatIndex;
                const final = idx === FLAT.length - 1;
                const on = idx < lit;
                return (
                  <li key={s.year + s.strong}>
                    <button
                      type="button"
                      className={`ec-stop${final ? " final" : ""}${on ? " is-on" : ""}`}
                      aria-haspopup="dialog"
                      onClick={(e) => {
                        returnFocus.current = e.currentTarget;
                        setOpen(idx);
                      }}
                    >
                      <span className="ec-icon" aria-hidden="true">
                        <svg viewBox="0 0 48 48">{ICONS[s.icon]}</svg>
                      </span>
                      <span className="ec-dot" data-row={row} />
                      <span className="ec-body">
                        <span className="ec-year">{s.year}</span>
                        <span className="ec-what">
                          {s.what && `${s.what} `}
                          <b>{s.strong}</b>
                          {s.after}
                        </span>
                        <span className="ec-where">{s.where}</span>
                        {s.tag && <span className="ec-tag">{s.tag}</span>}
                        <span className="ec-more" aria-hidden="true">
                          Details <ArrowUpRight size={13} />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {current && open !== null && (
          <>
            <motion.div className="ec-scrim" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              key="sheet"
              className="ec-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ec-sheet-title"
              style={{ ["--c" as string]: `var(--ec-${current.chapter.key})` }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 28 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="ec-sheet-head">
                <span className="ec-sheet-chapter">{current.chapter.label}</span>
                <button type="button" className="ec-close" onClick={close} aria-label="Close" autoFocus>
                  <X size={18} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={open}
                  className="ec-sheet-body"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  <span className="ec-sheet-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48">{ICONS[current.icon]}</svg>
                  </span>
                  <p className="ec-sheet-year">{current.year}</p>
                  <h3 id="ec-sheet-title" className="ec-sheet-org">{current.detail.org}</h3>
                  <p className="ec-sheet-role">{current.detail.role}</p>
                  <p className="ec-sheet-meta">
                    <span>{current.detail.dates}</span>
                    {current.detail.place && <span>{current.detail.place}</span>}
                  </p>
                  {current.detail.points && (
                    <ul className="ec-sheet-points">
                      {current.detail.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  )}
                  {current.detail.quote && <blockquote className="ec-sheet-quote">“{current.detail.quote}”</blockquote>}
                  {current.detail.credentials && (
                    <ul className="ec-sheet-creds" aria-label="Awards and certifications">
                      {current.detail.credentials.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  )}
                  {current.detail.link && (
                    <a className="ec-sheet-link" href={current.detail.link.href} target="_blank" rel="noopener">
                      {current.detail.link.label} <ArrowUpRight size={14} />
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="ec-sheet-nav">
                <button type="button" disabled={open === 0} onClick={() => setOpen(open - 1)}>
                  <ArrowLeft size={15} />
                  <span>{open > 0 ? `${FLAT[open - 1].year} · ${FLAT[open - 1].strong}` : "Start"}</span>
                </button>
                <span className="ec-sheet-count">{open + 1} / {FLAT.length}</span>
                <button type="button" disabled={open === FLAT.length - 1} onClick={() => setOpen(open + 1)}>
                  <span>{open < FLAT.length - 1 ? `${FLAT[open + 1].year} · ${FLAT[open + 1].strong}` : "End"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
