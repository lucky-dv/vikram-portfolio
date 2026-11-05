"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import portrait from "@/public/vikram.jpg";
import { site } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease },
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section className="hero" ref={ref} aria-labelledby="name">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <motion.p className="label" {...rise(0.05)}>
            {site.tagline}
          </motion.p>
          <motion.h1 id="name" {...rise(0.15)}>
            Vikram <em>Parekh</em>
          </motion.h1>
          <motion.p className="lede" {...rise(0.3)}>
            I&rsquo;m building the talent infrastructure for <em>data, AI and analytics.</em>
          </motion.p>
          <motion.p className="hero-meta" {...rise(0.4)}>
            Co-founder of{" "}
            <a href="https://www.datavruti.com" target="_blank" rel="noopener">datavruti</a>, building{" "}
            <a href="https://estana.in" target="_blank" rel="noopener">estana</a> and{" "}
            <a href="https://mygraph.id" target="_blank" rel="noopener">graph</a>. Based in Ahmedabad, India.
          </motion.p>
          <motion.div className="hero-links" {...rise(0.5)}>
            <a className="btn" href={site.linkedin} target="_blank" rel="me noopener">
              Connect on LinkedIn <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="plain" href="#writing">
              Read what I write <span className="arrow" aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          className="portrait"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
        >
          <motion.div className="portrait-img" style={{ y: portraitY }}>
            <Image
              src={portrait}
              alt="Vikram Parekh, co-founder of datavruti, smiling with arms folded"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 900px) 40vw, 100vw"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
