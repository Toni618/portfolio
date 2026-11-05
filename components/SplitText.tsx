"use client";

import { motion } from "framer-motion";

/** Reveals a heading word by word (slides up from behind a mask). */
export default function SplitText({
  text,
  className = "",
  wordClassName = "",
  delay = 0.1,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={className} dir="auto" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.15em] align-bottom me-[0.25em]">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: "115%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
