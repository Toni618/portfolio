import Link from "next/link";
import type { Project } from "@/lib/types";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

export default function ProjectCard({ p, index = 0 }: { p: Project; index?: number }) {
  return (
    <Reveal delay={(index % 3) * 0.1}>
      <Link href={`/projects/${p.slug}`} className="block">
        <TiltCard className="glass glow overflow-hidden rounded-3xl">
          {p.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt={p.title} className="h-52 w-full object-cover" loading="lazy" />
          )}
          <div className="p-6">
            <h3 dir="auto" className="text-xl font-bold">{p.title}</h3>
            <p dir="auto" className="mt-2 text-white/70">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-neon-green">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </TiltCard>
      </Link>
    </Reveal>
  );
}
