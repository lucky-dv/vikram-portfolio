"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import portrait from "@/public/vikram-profile.png";
import { site } from "@/lib/content";

/**
 * The entrance is a CSS animation (.rise in globals.css), not a JS one: it starts on first paint,
 * so the name and portrait (the page's LCP candidates) never wait for hydration and still show
 * when JavaScript fails. Only the scroll parallax needs JS.
 */
const rise = (delay: number, cls = "") => ({ className: `${cls} rise`.trim(), style: { "--d": `${delay}s` } as React.CSSProperties });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section className="hero" ref={ref} aria-labelledby="name">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <p {...rise(0.05, "label")}>{site.tagline}</p>
          <h1 id="name" {...rise(0.15)}>
            Vikram <em>Parekh</em>
          </h1>
          <p {...rise(0.3, "lede")}>
            I&rsquo;m building the talent infrastructure for <em>data, AI and analytics.</em>
          </p>
          <p {...rise(0.4, "hero-meta")}>
            Co-founder of{" "}
            <a href="https://www.datavruti.com" target="_blank" rel="noopener">datavruti</a>, building{" "}
            <a href="https://estana.in" target="_blank" rel="noopener">estana</a> and{" "}
            <a href="https://mygraph.id" target="_blank" rel="noopener">graph</a>. Based in Ahmedabad, India.
          </p>
          <div className="hero-links rise" style={{ "--d": "0.5s" } as React.CSSProperties}>
            <a className="btn" href={site.linkedin} target="_blank" rel="me noopener">
              Connect on LinkedIn <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="plain" href="#writing">
              Read what I write <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="portrait rise rise-fade" style={{ "--d": "0.2s" } as React.CSSProperties}>
          <motion.div className="portrait-img" style={{ y: portraitY }}>
            <Image
              src={portrait}
              alt="Vikram Parekh, co-founder of datavruti, smiling with arms folded, in a navy blazer"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 900px) 40vw, 100vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
