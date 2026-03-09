"use client";

import { useEffect, useState } from "react";
import { type Locale, t } from "@/lib/translations";
import { Dice } from "@/components/Dice";

type RollResult = "nothing" | "share" | "block";

interface Config {
  diceSides: number;
  shareTarget: number;
  blockTarget: number;
}

export function MinerForm({ locale }: { locale: Locale }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ result: RollResult; roll: number } | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (data.roll !== undefined && data.result) {
        setLastResult({ result: data.result, roll: data.roll });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto w-full">
      {config && (
        <div
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 gap-y-2 mb-4 sm:mb-6 animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.02s", animationFillMode: "forwards" }}
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-700/40 text-emerald-300 text-xs sm:text-sm">
            <span aria-hidden>✨</span>
            {t(locale, "miner.shareRule")} <strong className="tabular-nums">{config.shareTarget}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-bitcoin-orange/20 border border-bitcoin-orange/50 text-bitcoin-orange text-xs sm:text-sm">
            <span aria-hidden>🧱</span>
            {t(locale, "miner.blockRule")} <strong className="tabular-nums">{config.blockTarget}</strong>
          </span>
        </div>
      )}
      <div
        className="bg-bitcoin-surface border border-bitcoin-border rounded-2xl p-4 sm:p-6 shadow-card animate-scale-in opacity-0"
        style={{ animationFillMode: "forwards" }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}>
            <label htmlFor="username" className="block text-left text-sm font-medium text-gray-300 mb-2">
              {t(locale, "miner.enterName")}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t(locale, "miner.placeholder")}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-bitcoin-dark border border-bitcoin-border text-white placeholder-gray-500 focus:ring-2 focus:ring-bitcoin-orange focus:border-bitcoin-orange transition-shadow"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className={`w-full min-h-[48px] py-4 px-6 rounded-xl bg-bitcoin-orange text-bitcoin-dark font-heading font-bold text-base sm:text-lg hover:bg-bitcoin-orange-light active:scale-[0.98] disabled:cursor-not-allowed transition-all shadow-glow animate-fade-in-up opacity-0 ${
              loading ? "disabled:opacity-100 relative overflow-hidden" : "disabled:opacity-50"
            }`}
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            {loading && (
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-shimmer"
                aria-hidden
              />
            )}
            <span className="relative">{loading ? t(locale, "miner.mining") : t(locale, "miner.mine")}</span>
          </button>
        </form>
      </div>

      {lastResult && (
        <div
          className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl border-2 shadow-card animate-result-pop opacity-0 flex flex-col items-center ${
            lastResult.result === "block"
              ? "border-bitcoin-orange bg-bitcoin-orange/10 animate-block-glow"
              : lastResult.result === "share"
                ? "border-emerald-500/60 bg-emerald-950/30"
                : "border-bitcoin-border bg-bitcoin-surface"
          }`}
          style={{ animationFillMode: "forwards" }}
        >
          <Dice roll={lastResult.roll} result={lastResult.result} />
          <p
            className="text-lg font-heading font-semibold mt-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          >
            {lastResult.result === "block" && t(locale, "miner.result.block")}
            {lastResult.result === "share" && t(locale, "miner.result.share")}
            {lastResult.result === "nothing" && t(locale, "miner.result.nothing")}
          </p>
          <p
            className="text-sm text-gray-400 mt-1 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            {t(locale, "miner.rollWas")}: <strong className="text-gray-200">{lastResult.roll}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
