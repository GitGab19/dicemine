import { createHmac } from "crypto";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "dicemine_settings";
const MAX_AGE_SEC = 24 * 60 * 60; // 24 hours

function getSecret(): string {
  const secret = process.env.SETTINGS_SESSION_SECRET;
  if (secret) return secret;
  // Fallback for dev only; production should set SETTINGS_SESSION_SECRET
  return process.env.NODE_ENV === "production" ? "" : "dev-secret-change-in-production";
}

function sign(value: string): string {
  const secret = getSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSettingsToken(): string {
  const timestamp = String(Date.now());
  const signature = sign(timestamp);
  return `${timestamp}.${signature}`;
}

export function verifySettingsToken(token: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, sig] = parts;
  const expected = sign(timestamp);
  if (expected !== sig) return false;
  const age = Date.now() - Number(timestamp);
  if (age < 0 || age > MAX_AGE_SEC * 1000) return false;
  return true;
}

export function getSettingsPassword(): string | undefined {
  return process.env.SETTINGS_PASSWORD;
}

export function isSettingsProtected(): boolean {
  return Boolean(getSettingsPassword());
}

export async function getSettingsSession(): Promise<boolean> {
  if (!isSettingsProtected()) return true;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySettingsToken(token);
}

export function getSettingsSessionFromRequest(req: NextRequest): boolean {
  if (!isSettingsProtected()) return true;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySettingsToken(token);
}

export function getSettingsCookieAttrs(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: createSettingsToken(),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: MAX_AGE_SEC,
    },
  };
}

/** Build Set-Cookie header value for the settings session cookie */
export function buildSettingsSetCookieHeader(): string {
  const { name, value, options } = getSettingsCookieAttrs();
  const opts = options as { httpOnly?: boolean; secure?: boolean; sameSite?: string; path?: string; maxAge?: number };
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (opts.maxAge != null) parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.path) parts.push(`Path=${opts.path}`);
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}
