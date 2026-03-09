import { resetWorkshop } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";
import { getSettingsSessionFromRequest } from "@/lib/settings-auth";

export async function POST(req: NextRequest) {
  if (!getSettingsSessionFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  resetWorkshop();
  return NextResponse.json({ ok: true });
}
