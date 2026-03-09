import { NextRequest, NextResponse } from "next/server";
import {
  getSettingsPassword,
  getSettingsSessionFromRequest,
  isSettingsProtected,
  buildSettingsSetCookieHeader,
} from "@/lib/settings-auth";

export async function GET(req: NextRequest) {
  if (!isSettingsProtected()) {
    return NextResponse.json({ authenticated: true });
  }
  const ok = getSettingsSessionFromRequest(req);
  return NextResponse.json({ authenticated: ok });
}

export async function POST(req: NextRequest) {
  const password = getSettingsPassword();
  if (!password) {
    return NextResponse.json({ authenticated: true });
  }
  try {
    const body = await req.json();
    if (body.password !== password) {
      return NextResponse.json({ error: "Wrong password", authenticated: false }, { status: 401 });
    }
    const setCookie = buildSettingsSetCookieHeader();
    const res = NextResponse.json({ ok: true, authenticated: true });
    res.headers.set("Set-Cookie", setCookie);
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
