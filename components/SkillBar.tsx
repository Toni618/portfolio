"use client";

import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

export default function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="glass rounded-2xl p-5">
        <div className="mb-3 flex justify-between gap-4">
          <span dir="auto" className="font-semibold">{name}</span>
          <span className="text-neon-green">{level}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-pink to-neon-green shadow-[0_0_12px_rgba(255,61,154,0.6)]"
          />
        </div>
      </TiltCard>
    </motion.div>
  );
}
