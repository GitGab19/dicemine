import { getConfig, setConfig } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";
import { getSettingsSessionFromRequest } from "@/lib/settings-auth";

export function GET() {
  return NextResponse.json(getConfig());
}

export async function POST(req: NextRequest) {
  if (!getSettingsSessionFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { diceSides, shareTarget, blockTarget } = body;
    const updated = setConfig({
      ...(diceSides != null && { diceSides: Number(diceSides) }),
      ...(shareTarget != null && { shareTarget: Number(shareTarget) }),
      ...(blockTarget != null && { blockTarget: Number(blockTarget) }),
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid config" }, { status: 400 });
  }
}
