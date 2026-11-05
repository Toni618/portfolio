import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getProjects, getSettings, getSkills } from "@/lib/data";
import { SETTING_FIELDS } from "@/lib/settings";
import type { Project } from "@/lib/types";
import { deleteProject, deleteSkill, logout, saveProject, saveSettings, saveSkill } from "./actions";

export const dynamic = "force-dynamic";

const input = "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-neon-blue";
const btn = "rounded-xl bg-gradient-to-r from-neon-blue to-neon-pink px-4 py-2 font-semibold";
const danger = "rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-2 font-semibold text-red-300";
const label = "mb-1 mt-3 block text-sm text-white/60";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [settings, skills, projects] = await Promise.all([getSettings(), getSkills(), getProjects()]);

  const groups = [...new Set(SETTING_FIELDS.map((f) => f.group))];

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-5 py-12">
      <div className="flex items-center justify-between">
        <h1 className="grad-text text-4xl font-bold">Admin panel</h1>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="glass rounded-xl px-4 py-2 font-semibold">View site</a>
          <form action={logout}>
            <button className={danger}>Logout</button>
          </form>
        </div>
      </div>

      {/* SETTINGS */}
      <section className="glass rounded-3xl p-6">
        <h2 className="mb-2 text-2xl font-bold text-neon-blue">Site texts</h2>
        <p className="text-sm text-white/50">Every text on the site, including the site name, can be changed here.</p>
        <form action={saveSettings}>
          {groups.map((g) => (
            <details key={g} className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4" open={g === "Site" || g === "Hero"}>
              <summary className="cursor-pointer font-semibold text-neon-pink">{g}</summary>
              {SETTING_FIELDS.filter((f) => f.group === g).map((f) => (
                <div key={f.key}>
                  <label className={label}>{f.label}</label>
                  {f.multiline ? (
                    <textarea name={f.key} dir="auto" defaultValue={settings[f.key] ?? ""} rows={5} className={input} />
                  ) : (
                    <input name={f.key} dir="auto" defaultValue={settings[f.key] ?? ""} className={input} />
                  )}
                </div>
              ))}
            </details>
          ))}
          <button className={`${btn} mt-6`}>Save all texts</button>
        </form>
      </section>

      {/* SKILLS */}
      <section className="glass rounded-3xl p-6">
        <h2 className="mb-4 text-2xl font-bold text-neon-pink">Skills</h2>
        <div className="space-y-3">
          {skills.map((k) => (
            <div key={k.id} className="flex flex-wrap gap-2">
              <form action={saveSkill} className="flex flex-1 gap-2">
                <input type="hidden" name="id" value={k.id} />
                <input name="name" dir="auto" defaultValue={k.name} className={input} />
                <input name="level" type="number" min={0} max={100} defaultValue={k.level} className={`${input} !w-24`} />
                <button className={btn}>Save</button>
              </form>
              <form action={deleteSkill}>
                <input type="hidden" name="id" value={k.id} />
                <button className={danger}>Delete</button>
              </form>
            </div>
          ))}
        </div>
        <form action={saveSkill} className="mt-5 flex gap-2 border-t border-white/10 pt-5">
          <input name="name" dir="auto" placeholder="New skill" className={input} />
          <input name="level" type="number" min={0} max={100} defaultValue={80} className={`${input} !w-24`} />
          <button className={btn}>Add</button>
        </form>
      </section>

      {/* PROJECTS */}
      <section className="glass rounded-3xl p-6">
        <h2 className="mb-4 text-2xl font-bold text-neon-green">Projects</h2>
        <div className="space-y-3">
          {projects.map((p) => (
            <details key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <summary className="cursor-pointer font-semibold">{p.title}</summary>
              <ProjectForm p={p} />
              <form action={deleteProject} className="mt-3">
                <input type="hidden" name="id" value={p.id} />
                <button className={danger}>Delete project</button>
              </form>
            </details>
          ))}
        </div>
        <details className="mt-5 rounded-2xl border border-neon-green/40 p-4">
          <summary className="cursor-pointer font-semibold text-neon-green">+ New project</summary>
          <ProjectForm />
        </details>
      </section>
    </div>
  );
}

function ProjectForm({ p }: { p?: Project }) {
  return (
    <form action={saveProject}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <label className={label}>Title</label>
      <input name="title" dir="auto" defaultValue={p?.title} className={input} />
      <label className={label}>Slug (English letters for the URL, optional)</label>
      <input name="slug" defaultValue={p?.slug} className={input} />
      <label className={label}>Short summary</label>
      <input name="summary" dir="auto" defaultValue={p?.summary} className={input} />
      <label className={label}>Full description</label>
      <textarea name="description" dir="auto" defaultValue={p?.description} rows={6} className={input} />
      <label className={label}>Image (full URL, or a path like /images/shop.jpg from the public folder)</label>
      <input name="image" defaultValue={p?.image} className={input} />
      <label className={label}>Tags (comma separated)</label>
      <input name="tags" dir="auto" defaultValue={p?.tags.join(", ")} className={input} />
      <label className={label}>Live link</label>
      <input name="link" defaultValue={p?.link} className={input} />
      <label className={label}>Repo link</label>
      <input name="repo" defaultValue={p?.repo} className={input} />
      <label className={label}>Order (0 = first)</label>
      <input name="sort" type="number" defaultValue={p?.sort ?? 0} className={`${input} !w-28`} />
      <button className={`${btn} mt-4`}>{p ? "Save project" : "Create project"}</button>
    </form>
  );
}
