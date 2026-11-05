"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span" | "h2" | "section";
};

export default function Reveal({ children, delay = 0, y = 24, className, as = "div" }: Props) {
  const Tag = motion[as] as ElementType;
  return (
    <Tag
      className={className ? `reveal ${className}` : "reveal"}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
