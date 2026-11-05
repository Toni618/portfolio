"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

/** "50+" counts from 0 to 50 when it scrolls into view. Text without a number is shown as is. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const m = value.match(/^(\D*)(\d+)(.*)$/);
    if (!inView || !m) return;
    const [, pre, num, post] = m;
    const controls = animate(0, Number(num), {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${pre}${Math.round(v)}${post}`;
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{value}</span>;
}
