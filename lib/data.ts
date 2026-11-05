import type { Row } from "@libsql/client";
import { db, initDb } from "./db";
import { DEFAULTS } from "./settings";
import type { Project, Skill } from "./types";

const toProject = (r: Row): Project => ({
  id: Number(r.id),
  slug: String(r.slug),
  title: String(r.title),
  summary: String(r.summary),
  description: String(r.description),
  image: String(r.image),
  tags: String(r.tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean),
  link: String(r.link),
  repo: String(r.repo),
  sort: Number(r.sort),
});

export async function getSettings(): Promise<Record<string, string>> {
  await initDb();
  const r = await db.execute("SELECT key, value FROM settings");
  return { ...DEFAULTS, ...Object.fromEntries(r.rows.map((x) => [String(x.key), String(x.value)])) };
}

export async function getSkills(): Promise<Skill[]> {
  await initDb();
  const r = await db.execute("SELECT * FROM skills ORDER BY sort, id");
  return r.rows.map((x) => ({ id: Number(x.id), name: String(x.name), level: Number(x.level) }));
}

export async function getProjects(): Promise<Project[]> {
  await initDb();
  const r = await db.execute("SELECT * FROM projects ORDER BY sort, id");
  return r.rows.map(toProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  await initDb();
  const r = await db.execute({ sql: "SELECT * FROM projects WHERE slug = ?", args: [slug] });
  return r.rows[0] ? toProject(r.rows[0]) : null;
}
