import CountUp from "@/components/CountUp";
import Hero from "@/components/Hero";
import HScroll from "@/components/HScroll";
import Marquee from "@/components/Marquee";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SkillBar from "@/components/SkillBar";
import SplitText from "@/components/SplitText";
import { getProjects, getSettings, getSkills } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [s, skills, projects] = await Promise.all([getSettings(), getSkills(), getProjects()]);

  const stats = [
    [s.stat1Value, s.stat1Label],
    [s.stat2Value, s.stat2Label],
    [s.stat3Value, s.stat3Label],
  ].filter(([v]) => v);

  return (
    <>
      <Hero tag={s.heroTag} title={s.heroTitle} subtitle={s.heroSubtitle} cta1={s.ctaPrimary} cta2={s.ctaSecondary} />

      <Marquee items={skills.map((k) => k.name)} />

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-5 py-28">
        <SplitText as="h2" text={s.aboutTitle} className="mb-8 text-4xl font-bold md:text-5xl" wordClassName="grad-text" />
        <Reveal>
          <div dir="auto" className="glass whitespace-pre-line rounded-3xl p-8 text-lg leading-8 text-white/80 md:p-12">
            {s.aboutText}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {stats.map(([value, label], i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="glass glow rounded-3xl p-8 text-center">
                <div className="grad-text text-5xl font-bold md:text-6xl">
                  <CountUp value={value} />
                </div>
                <div dir="auto" className="mt-2 text-white/60">{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="mx-auto max-w-6xl px-5 py-28">
        <SplitText as="h2" text={s.skillsTitle} className="mb-10 text-4xl font-bold md:text-5xl" wordClassName="grad-text" />
        <div className="grid gap-5 md:grid-cols-2">
          {skills.map((k, i) => (
            <SkillBar key={k.id} name={k.name} level={k.level} index={i} />
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-10">
        {/* Desktop: pinned horizontal scroll */}
        <HScroll projects={projects} title={s.projectsTitle} />

        {/* Mobile: normal grid */}
        <div className="mx-auto max-w-6xl px-5 md:hidden">
          <h2 dir="auto" className="mb-8 text-4xl font-bold">
            <span className="grad-text">{s.projectsTitle}</span>
          </h2>
          <div className="grid gap-8">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl px-5 py-28">
        <Reveal>
          <div className="glass rounded-3xl p-10 text-center md:p-16">
            <h2 dir="auto" className="grad-text text-4xl font-bold md:text-6xl">{s.contactTitle}</h2>
            <p dir="auto" className="mx-auto mt-4 max-w-xl text-lg text-white/70">{s.contactText}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${s.email}`}
                className="glow rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink px-8 py-4 font-semibold transition hover:scale-105"
              >
                {s.email}
              </a>
              <a
                href={s.github}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-2xl px-8 py-4 font-semibold transition hover:scale-105 hover:border-neon-green"
              >
                GitHub
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
