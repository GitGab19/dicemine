import { rollDice } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username : "Anonymous";
    const event = rollDice(username);
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
