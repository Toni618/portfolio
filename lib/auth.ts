import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export function sessionToken() {
  return createHmac("sha256", process.env.AUTH_SECRET || "dev-secret")
    .update(process.env.ADMIN_PASSWORD || "")
    .digest("hex");
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const c = (await cookies()).get("admin")?.value;
  if (!c) return false;
  const a = Buffer.from(c);
  const b = Buffer.from(sessionToken());
  return a.length === b.length && timingSafeEqual(a, b);
}
