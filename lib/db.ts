import { createClient } from "@libsql/client";
import { DEFAULTS } from "./settings";

// Local: a file database (local.db). Production: Turso (DATABASE_URL + DATABASE_AUTH_TOKEN).
export const db = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
});

let ready: Promise<void> | null = null;

export function initDb() {
  if (!ready) {
    ready = setup().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

async function setup() {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        level INTEGER NOT NULL DEFAULT 80,
        sort INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        image TEXT NOT NULL DEFAULT '',
        tags TEXT NOT NULL DEFAULT '',
        link TEXT NOT NULL DEFAULT '',
        repo TEXT NOT NULL DEFAULT '',
        sort INTEGER NOT NULL DEFAULT 0
      )`,
    ],
    "write"
  );

  // Missing settings get their default value (existing ones are never touched).
  await db.batch(
    Object.entries(DEFAULTS).map(([k, v]) => ({
      sql: "INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)",
      args: [k, v],
    })),
    "write"
  );

  // First run only: demo skills and projects.
  const seeded = await db.execute("SELECT 1 FROM settings WHERE key='_seeded'");
  if (seeded.rows.length === 0) {
    const skills = ["React / Next.js", "TypeScript", "Three.js / 3D", "Node.js", "UI Design", "Databases"];
    const projects = [
      ["neon-shop", "Neon Shop", "A fast, beautiful e-commerce experience.", "Full description of this project.\n\nWhat I did, which tools I used, and the results.", "https://picsum.photos/seed/neon1/1200/800", "Next.js, Stripe, Tailwind"],
      ["cloud-dash", "Cloud Dashboard", "Realtime analytics dashboard.", "Full description of this project.\n\nWhat I did, which tools I used, and the results.", "https://picsum.photos/seed/neon2/1200/800", "React, Charts, API"],
      ["space-game", "Space Game", "A 3D browser game.", "Full description of this project.\n\nWhat I did, which tools I used, and the results.", "https://picsum.photos/seed/neon3/1200/800", "Three.js, WebGL"],
      ["pink-studio", "Pink Studio", "Brand identity and landing page.", "Full description of this project.\n\nWhat I did, which tools I used, and the results.", "https://picsum.photos/seed/neon4/1200/800", "Figma, Design, Motion"],
    ];
    await db.batch(
      [
        ...skills.map((n, i) => ({
          sql: "INSERT INTO skills(name,level,sort) VALUES(?,?,?)",
          args: [n, 92 - i * 4, i],
        })),
        ...projects.map((p, i) => ({
          sql: "INSERT INTO projects(slug,title,summary,description,image,tags,sort) VALUES(?,?,?,?,?,?,?)",
          args: [...p, i],
        })),
        { sql: "INSERT OR IGNORE INTO settings(key,value) VALUES('_seeded','1')", args: [] },
      ],
      "write"
    );
  }
}
