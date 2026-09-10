import { env } from "cloudflare:workers";

const encoder = new TextEncoder();

async function signature(value: string) {
  if (!env.ADMIN_SESSION_SECRET) return "";
  const key = await crypto.subtle.importKey("raw", encoder.encode(env.ADMIN_SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createAdminToken() {
  const expires = Date.now() + 1000 * 60 * 60 * 12;
  const value = `lim-admin.${expires}`;
  return `${value}.${await signature(value)}`;
}

export async function isAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.match(/(?:^|; )lim_admin=([^;]+)/)?.[1];
  if (!token) return false;
  const decoded = decodeURIComponent(token);
  const parts = decoded.split(".");
  if (parts.length !== 3 || Number(parts[1]) < Date.now()) return false;
  const value = `${parts[0]}.${parts[1]}`;
  return parts[2] === await signature(value);
}

export function adminConfigured() {
  return Boolean(env.ADMIN_PASSWORD && env.ADMIN_SESSION_SECRET);
}

export function validPassword(value: string) {
  return Boolean(env.ADMIN_PASSWORD && value === env.ADMIN_PASSWORD);
}
