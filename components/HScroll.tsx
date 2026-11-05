"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/lib/types";

const STEP = 66; // card width (62vw) + gap (4vw)

/** Desktop: the section stays pinned while vertical scrolling moves the cards sideways. */
export default function HScroll({ projects, title }: { projects: Project[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = projects.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${Math.max(n - 1, 0) * STEP}vw`]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} style={{ height: `${Math.max(n, 1) * 70 + 30}vh` }} className="relative hidden md:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <h2 dir="auto" className="px-[8vw] text-4xl font-bold md:text-5xl">
          <span className="grad-text">{title}</span>
        </h2>

        <motion.div style={{ x }} className="mt-10 flex gap-[4vw] px-[8vw]">
          {projects.map((p, i) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="block w-[62vw] shrink-0">
              <div className="glass glow flex h-[52vh] overflow-hidden rounded-3xl">
                <div className="relative w-1/2 overflow-hidden">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/30 via-transparent to-neon-pink/30" />
                </div>
                <div className="flex w-1/2 flex-col justify-center p-8 lg:p-10">
                  <span className="grad-text text-6xl font-bold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 dir="auto" className="mt-3 text-3xl font-bold">{p.title}</h3>
                  <p dir="auto" className="mt-3 line-clamp-3 text-white/70">{p.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-neon-green">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 font-semibold text-neon-pink">View project →</span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        <div className="mx-[8vw] mt-10 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div style={{ width: bar }} className="h-full bg-gradient-to-r from-neon-blue via-neon-pink to-neon-green" />
        </div>
      </div>
    </div>
  );
}
