import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import { getProject } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-4xl px-5 py-16">
      <Link href="/#projects" className="text-neon-green hover:underline">
        ← Back
      </Link>

      <SplitText text={p.title} className="mt-6 text-4xl font-bold md:text-6xl" wordClassName="grad-text" />

      <Reveal delay={0.2}>
        <p dir="auto" className="mt-4 text-xl text-white/70">{p.summary}</p>
      </Reveal>

      {p.image && (
        <Reveal delay={0.1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.title} className="glass mt-10 w-full rounded-3xl object-cover" />
        </Reveal>
      )}

      <Reveal>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/10 px-4 py-1 text-sm text-neon-green">
              {t}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div dir="auto" className="glass mt-10 whitespace-pre-line rounded-3xl p-8 text-lg leading-8 text-white/85">
          {p.description}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-10 flex flex-wrap gap-4">
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="glow rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink px-8 py-4 font-semibold"
            >
              Live demo
            </a>
          )}
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-2xl px-8 py-4 font-semibold hover:border-neon-green"
            >
              Source code
            </a>
          )}
        </div>
      </Reveal>
    </article>
  );
}
