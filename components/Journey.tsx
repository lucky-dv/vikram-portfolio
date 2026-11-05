"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { journey } from "@/lib/content";
import Reveal from "./Reveal";

export default function Journey() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.4 });

  return (
    <section className="block" id="journey" aria-labelledby="journey-h">
      <div className="wrap split">
        <Reveal className="split-head">
          <p className="label">How I got here</p>
          <h2 id="journey-h">
            Eight years on <em>one problem</em>
          </h2>
          <p className="muted">From an HR tech start, through a near-collapse, to three products built on the same idea.</p>
        </Reveal>
        <div className="timeline-wrap" ref={listRef}>
          <span className="timeline-rail" aria-hidden="true">
            <motion.span className="timeline-fill" style={{ scaleY }} />
          </span>
          <ol className="timeline">
          {journey.map((j, i) => (
            <Reveal as="li" key={j.year} delay={i * 0.04}>
              <span className="yr">{j.year}</span>
              <div>
                <h3>{j.title}</h3>
                <p>{j.text}</p>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
