import { getConfig, getEvents, getLeaderboard, getBlockFinders } from "@/lib/store";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    config: getConfig(),
    events: getEvents(),
    leaderboard: getLeaderboard(),
    blockFinders: getBlockFinders(),
  });
}
