"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SplitText from "./SplitText";

export default function Hero({
  tag,
  title,
  subtitle,
  cta1,
  cta2,
}: {
  tag: string;
  title: string;
  subtitle: string;
  cta1: string;
  cta2: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center">
      <motion.div style={{ y, opacity, scale }} className="mx-auto w-full max-w-6xl px-5">
        <motion.p
          dir="auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass mb-6 inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm text-neon-green"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-green" />
          </span>
          {tag}
        </motion.p>

        <SplitText
          text={title}
          className="max-w-5xl text-5xl font-bold leading-[1.1] md:text-7xl lg:text-8xl"
          wordClassName="grad-text"
          delay={0.25}
        />

        <motion.p
          dir="auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-8 max-w-2xl text-lg text-white/70 md:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="glow rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink px-8 py-4 font-semibold transition hover:scale-105"
          >
            {cta1}
          </a>
          <a href="#contact" className="glass rounded-2xl px-8 py-4 font-semibold transition hover:scale-105 hover:border-neon-green">
            {cta2}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute inset-x-0 bottom-8 flex justify-center"
        aria-hidden
      >
        <div className="flex h-12 w-7 justify-center rounded-full border-2 border-white/40 pt-2">
          <motion.span
            animate={{ y: [0, 16, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-2 w-1.5 rounded-full bg-neon-green"
          />
        </div>
      </motion.div>
    </section>
  );
}
