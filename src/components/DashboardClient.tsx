"use client";

import { useEffect, useState } from "react";
import { type Locale, t } from "@/lib/translations";

interface MiningEvent {
  id: string;
  username: string;
  roll: number;
  result: string;
  at: number;
}

interface LeaderboardEntry {
  username: string;
  shares: number;
  blocks: number;
}

interface DashboardData {
  config: { diceSides: number; shareTarget: number; blockTarget: number };
  events: MiningEvent[];
  leaderboard: LeaderboardEntry[];
  blockFinders: MiningEvent[];
}

export function DashboardClient({ locale }: { locale: Locale }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function fetchDashboard() {
      fetch("/api/dashboard")
        .then((res) => res.json())
        .then(setData)
        .catch(() => setError("Failed to load"));
    }
    fetchDashboard();
    const id = setInterval(fetchDashboard, 3000);
    return () => clearInterval(id);
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-4 text-red-400">
        {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="space-y-10 animate-fade-in-up">
        <div className="h-9 w-64 bg-bitcoin-surface rounded-lg" />
        <div className="h-48 bg-bitcoin-surface rounded-2xl overflow-hidden">
          <div className="h-12 bg-bitcoin-dark/80 border-b border-bitcoin-border" />
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 bg-bitcoin-dark/50 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        <p className="text-gray-400 font-medium flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-bitcoin-orange animate-pulse" />
          Loading dashboard…
        </p>
      </div>
    );
  }

  const shareEvents = data.events.filter((e) => e.result === "share" || e.result === "block");

  return (
    <div className="space-y-6 sm:space-y-10">
      <h1
        className="text-2xl sm:text-3xl font-heading font-bold text-bitcoin-orange tracking-tight animate-fade-in-up opacity-0 flex items-center gap-2"
        style={{ animationFillMode: "forwards" }}
      >
        <span className="text-2xl sm:text-3xl" aria-hidden>📊</span>
        {t(locale, "dashboard.title")}
      </h1>
      {data.config && (
        <p
          className="text-xs sm:text-sm text-gray-500 animate-fade-in-up opacity-0 flex flex-wrap items-center gap-2 sm:gap-4"
          style={{ animationDelay: "0.04s", animationFillMode: "forwards" }}
        >
          <span><span aria-hidden>✨</span> Share &lt; {data.config.shareTarget}</span>
          <span><span aria-hidden>🧱</span> Block &lt; {data.config.blockTarget}</span>
        </p>
      )}

      {/* Blockchain – blocks found in order */}
      <section
        className="animate-fade-in-up opacity-0"
        style={{ animationDelay: "0.06s", animationFillMode: "forwards" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg sm:text-xl" aria-hidden>🔗</span>
          <h2 className="text-base sm:text-lg font-heading font-semibold text-gray-200">
            {t(locale, "dashboard.blockchain")}
          </h2>
        </div>
        {data.blockFinders.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 px-4 rounded-xl bg-bitcoin-surface/50 border border-bitcoin-border border-dashed">
            {t(locale, "dashboard.noActivity")}
          </p>
        ) : (
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch pb-2">
            <div className="flex items-stretch gap-0 min-w-min">
              {[...data.blockFinders].reverse().map((block, index) => (
                <div key={block.id} className="flex items-center gap-0 shrink-0">
                  <div
                    className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] w-[100px] sm:w-[120px] py-3 px-2 rounded-lg bg-bitcoin-surface border-2 border-bitcoin-orange/60 shadow-glow mx-0.5"
                    title={`${t(locale, "dashboard.blockHeight")} ${index + 1}: ${block.username} (${block.roll})`}
                  >
                    <span className="text-xs text-bitcoin-orange font-heading font-bold">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-200 truncate w-full text-center mt-0.5">
                      {block.username}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">🎲 {block.roll}</span>
                    <span className="text-[10px] sm:text-xs text-gray-500 mt-1 tabular-nums">
                      {new Date(block.at).toLocaleTimeString()}
                    </span>
                  </div>
                  {index < data.blockFinders.length - 1 && (
                    <span className="text-bitcoin-orange/70 px-0.5 sm:px-1 shrink-0" aria-hidden>
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Leaderboard */}
      <section
        className="bg-bitcoin-surface border border-bitcoin-border rounded-xl sm:rounded-2xl overflow-hidden shadow-card animate-fade-in-up opacity-0"
        style={{ animationDelay: "0.08s", animationFillMode: "forwards" }}
      >
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-bitcoin-border flex items-center gap-2">
          <span className="text-lg sm:text-xl" aria-hidden>🏆</span>
          <h2 className="text-base sm:text-lg font-heading font-semibold text-gray-200">
            {t(locale, "dashboard.leaderboard")}
          </h2>
        </div>
        {data.leaderboard.length === 0 ? (
          <p className="px-3 sm:px-5 py-6 sm:py-8 text-gray-500 text-sm sm:text-base">{t(locale, "dashboard.noActivity")}</p>
        ) : (
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full text-left min-w-[260px]">
              <thead className="bg-bitcoin-dark/80 text-gray-400 text-xs sm:text-sm">
                <tr>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 font-medium">#</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 font-medium">{t(locale, "dashboard.user")}</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 font-medium">{t(locale, "dashboard.shares")}</th>
                  <th className="px-3 sm:px-5 py-2 sm:py-3 font-medium">{t(locale, "dashboard.blocks")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bitcoin-border">
                {data.leaderboard.map((row, i) => {
                  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                  return (
                    <tr
                      key={row.username}
                      className="hover:bg-bitcoin-dark/50 transition-colors animate-table-row-in opacity-0"
                      style={{
                        animationDelay: `${0.12 + i * 0.04}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-gray-500 text-sm">
                        {medal ? <span className="text-base sm:text-lg" aria-hidden>{medal}</span> : i + 1}
                      </td>
                      <td className="px-3 sm:px-5 py-2.5 sm:py-3 font-medium text-gray-200 text-sm sm:text-base">{row.username}</td>
                      <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-gray-300 text-sm sm:text-base">
                        <span className="inline-flex items-center gap-1">
                          <span aria-hidden>✨</span>
                          {row.shares}
                        </span>
                      </td>
                      <td className="px-3 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base">
                        {row.blocks > 0 ? (
                          <span className="inline-flex items-center gap-1 text-bitcoin-orange font-semibold">
                            <span className="inline-block animate-pulse" aria-hidden>🧱</span>
                            {row.blocks}
                          </span>
                        ) : (
                          "–"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Block finders */}
      {data.blockFinders.length > 0 && (
        <section
          className="bg-bitcoin-surface border border-bitcoin-border rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-card animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.16s", animationFillMode: "forwards" }}
        >
          <h2 className="text-base sm:text-lg font-heading font-semibold text-gray-200 mb-3 sm:mb-4 flex items-center gap-2">
            <span className="text-lg sm:text-xl" aria-hidden>🧱</span>
            {t(locale, "dashboard.blockFinders")}
          </h2>
          <ul className="space-y-2">
            {data.blockFinders.slice(0, 20).map((e, i) => (
              <li
                key={e.id}
                className="flex items-center gap-2 sm:gap-3 text-gray-300 text-xs sm:text-sm animate-table-row-in opacity-0 min-h-[44px]"
                style={{
                  animationDelay: `${0.2 + i * 0.03}s`,
                  animationFillMode: "forwards",
                }}
              >
                <span className="text-base sm:text-xl shrink-0" aria-hidden>🎉</span>
                <span className="text-bitcoin-orange font-medium truncate">{e.username}</span>
                <span className="text-gray-500 shrink-0">🎲 {e.roll}</span>
                <span className="text-gray-500 text-xs sm:text-sm ml-auto shrink-0">
                  {new Date(e.at).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent shares */}
      <section
        className="bg-bitcoin-surface border border-bitcoin-border rounded-xl sm:rounded-2xl overflow-hidden shadow-card animate-fade-in-up opacity-0"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-bitcoin-border flex items-center gap-2">
          <span className="text-lg sm:text-xl" aria-hidden>✨</span>
          <h2 className="text-base sm:text-lg font-heading font-semibold text-gray-200">
            {t(locale, "dashboard.recentShares")}
          </h2>
        </div>
        {shareEvents.length === 0 ? (
          <p className="px-3 sm:px-5 py-6 sm:py-8 text-gray-500 text-sm sm:text-base">{t(locale, "dashboard.noActivity")}</p>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-64 sm:max-h-80 -webkit-overflow-scrolling-touch">
            <table className="w-full text-left min-w-[240px]">
              <thead className="bg-bitcoin-dark/80 text-gray-400 text-xs sm:text-sm sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-5 py-2 sm:py-3 font-medium">{t(locale, "dashboard.user")}</th>
                  <th className="px-2 sm:px-5 py-2 sm:py-3 font-medium">{t(locale, "dashboard.roll")}</th>
                  <th className="px-2 sm:px-5 py-2 sm:py-3 font-medium">{t(locale, "dashboard.result")}</th>
                  <th className="px-2 sm:px-5 py-2 sm:py-3 font-medium">{t(locale, "dashboard.time")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bitcoin-border">
                {shareEvents.slice(0, 50).map((e, i) => (
                  <tr
                    key={e.id}
                    className="hover:bg-bitcoin-dark/30 animate-table-row-in opacity-0"
                    style={{
                      animationDelay: `${0.24 + Math.min(i, 12) * 0.02}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <td className="px-2 sm:px-5 py-2 sm:py-2.5 text-gray-200 text-sm truncate max-w-[100px] sm:max-w-none">{e.username}</td>
                    <td className="px-2 sm:px-5 py-2 sm:py-2.5 text-gray-300 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <span aria-hidden>🎲</span>
                        {e.roll}
                      </span>
                    </td>
                    <td className="px-2 sm:px-5 py-2 sm:py-2.5 text-sm">
                      {e.result === "block" ? (
                        <span className="inline-flex items-center gap-1 text-bitcoin-orange font-medium">
                          <span aria-hidden>🧱</span>
                          Block
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400/90">
                          <span aria-hidden>✨</span>
                          Share
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-5 py-2 sm:py-2.5 text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                      {new Date(e.at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
