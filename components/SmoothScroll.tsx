"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";

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
  // its instance when options change.
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={
          reduced
            ? { smoothWheel: false, syncTouch: false, anchors: { immediate: true } } // native scrolling, instant jumps
            : {
                lerp: 0.09,
                wheelMultiplier: 1,
                anchors: true, // offset comes from html { scroll-padding-top } (header height)
              }
        }
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
