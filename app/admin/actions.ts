"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, initDb } from "@/lib/db";
import { isAdmin, sessionToken } from "@/lib/auth";
import { SETTING_FIELDS } from "@/lib/settings";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
  await initDb();
}

function done(): never {
  revalidatePath("/", "layout");
  redirect("/admin");
}

const slugify = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || `project-${Date.now()}`;

export async function login(f: FormData) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || s(f, "password") !== pw) redirect("/admin/login?error=1");
  (await cookies()).set("admin", sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete("admin");
  redirect("/admin/login");
}

export async function saveSettings(f: FormData) {
  await guard();
  await db.batch(
    SETTING_FIELDS.map((x) => ({
      sql: "INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
      args: [x.key, String(f.get(x.key) ?? "")],
    })),
    "write"
  );
  done();
}

export async function saveSkill(f: FormData) {
  await guard();
  const id = s(f, "id");
  const name = s(f, "name");
  const level = Math.max(0, Math.min(100, Number(s(f, "level")) || 0));
  if (!name) done();
  if (id) {
    await db.execute({ sql: "UPDATE skills SET name=?, level=? WHERE id=?", args: [name, level, id] });
  } else {
    await db.execute({ sql: "INSERT INTO skills(name,level,sort) VALUES(?,?,999)", args: [name, level] });
  }
  done();
}

export async function deleteSkill(f: FormData) {
  await guard();
  await db.execute({ sql: "DELETE FROM skills WHERE id=?", args: [s(f, "id")] });
  done();
}

export async function saveProject(f: FormData) {
  await guard();
  const id = s(f, "id");
  const title = s(f, "title");
  if (!title) done();
  const slug = slugify(s(f, "slug") || title);
  const args = [
    slug,
    title,
    s(f, "summary"),
    String(f.get("description") ?? ""),
    s(f, "image"),
    s(f, "tags"),
    s(f, "link"),
    s(f, "repo"),
    Number(s(f, "sort")) || 0,
  ];
  if (id) {
    await db.execute({
      sql: "UPDATE projects SET slug=?, title=?, summary=?, description=?, image=?, tags=?, link=?, repo=?, sort=? WHERE id=?",
      args: [...args, id],
    });
  } else {
    await db.execute({
      sql: "INSERT INTO projects(slug,title,summary,description,image,tags,link,repo,sort) VALUES(?,?,?,?,?,?,?,?,?)",
      args,
    });
  }
  done();
}

export async function deleteProject(f: FormData) {
  await guard();
  await db.execute({ sql: "DELETE FROM projects WHERE id=?", args: [s(f, "id")] });
  done();
}
