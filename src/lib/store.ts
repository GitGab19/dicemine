/**
 * In-memory store for workshop mining simulation.
 * Share/block targets: roll is 0..diceSides-1. Share if roll < shareTarget, block if roll < blockTarget.
 * blockTarget must be <= shareTarget so that a block also counts as a share.
 */

export type RollResult = "nothing" | "share" | "block";

export interface MiningEvent {
  id: string;
  username: string;
  roll: number;
  result: RollResult;
  at: number;
}

export interface Config {
  diceSides: number;
  shareTarget: number; // roll < shareTarget → share (inclusive: 0..shareTarget-1)
  blockTarget: number; // roll < blockTarget → block (must be <= shareTarget)
}

const defaultConfig: Config = {
  diceSides: 1000,
  shareTarget: 100,  // 10% share rate
  blockTarget: 4,    // 0.4% block rate (like "roll below 4" in the handbook)
};

let config: Config = { ...defaultConfig };
const events: MiningEvent[] = [];
const idSeq = { next: 1 };

function nextId(): string {
  return String(idSeq.next++);
}

function clampConfig(c: Config): Config {
  const diceSides = Math.max(2, Math.min(1_000_000, c.diceSides));
  const shareTarget = Math.max(1, Math.min(diceSides, c.shareTarget));
  const blockTarget = Math.max(0, Math.min(shareTarget, c.blockTarget));
  return { diceSides, shareTarget, blockTarget };
}

export function getConfig(): Config {
  return { ...config };
}

export function setConfig(c: Partial<Config>): Config {
  config = clampConfig({ ...config, ...c });
  return getConfig();
}

export function rollDice(username: string): MiningEvent {
  const roll = Math.floor(Math.random() * config.diceSides);
  let result: RollResult = "nothing";
  if (roll < config.blockTarget) result = "block";
  else if (roll < config.shareTarget) result = "share";

  const event: MiningEvent = {
    id: nextId(),
    username: username.trim().slice(0, 64) || "Anonymous",
    roll,
    result,
    at: Date.now(),
  };
  events.push(event);
  return event;
}

export function getEvents(limit = 200): MiningEvent[] {
  return [...events].reverse().slice(0, limit);
}

export function getLeaderboard(): { username: string; shares: number; blocks: number }[] {
  const map = new Map<string, { shares: number; blocks: number }>();
  for (const e of events) {
    const cur = map.get(e.username) ?? { shares: 0, blocks: 0 };
    if (e.result === "block") {
      cur.blocks += 1;
      cur.shares += 1; // block counts as share
    } else if (e.result === "share") {
      cur.shares += 1;
    }
    map.set(e.username, cur);
  }
  return [...map.entries()]
    .map(([username, { shares, blocks }]) => ({ username, shares, blocks }))
    .sort((a, b) => b.shares - a.shares);
}

export function getBlockFinders(): MiningEvent[] {
  return events.filter((e) => e.result === "block").reverse();
}

export function resetWorkshop(): void {
  events.length = 0;
  idSeq.next = 1;
}
