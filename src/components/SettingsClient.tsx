"use client";

import { useEffect, useState } from "react";
import { type Locale, t } from "@/lib/translations";

interface Config {
  diceSides: number;
  shareTarget: number;
  blockTarget: number;
}

export function SettingsClient({ locale }: { locale: Locale }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [form, setForm] = useState<Config>({
    diceSides: 1000,
    shareTarget: 100,
    blockTarget: 4,
  });
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((c) => {
        setConfig(c);
        setForm(c);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setConfig(updated);
    setForm(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleReset() {
    if (!confirm(t(locale, "settings.resetConfirm"))) return;
    setResetting(true);
    try {
      await fetch("/api/reset", { method: "POST" });
    } finally {
      setResetting(false);
    }
  }

  if (!config) {
    return <p className="text-gray-400 font-medium">Loading settings…</p>;
  }

  const inputClass =
    "w-full min-h-[48px] px-4 py-3 rounded-xl bg-bitcoin-dark border border-bitcoin-border text-white focus:ring-2 focus:ring-bitcoin-orange focus:border-bitcoin-orange transition-shadow";

  return (
    <div className="max-w-lg w-full space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-bitcoin-orange tracking-tight">
          {t(locale, "settings.title")}
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">{t(locale, "settings.subtitle")}</p>
      </div>

      <div className="bg-bitcoin-surface border border-bitcoin-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="diceSides" className="block text-sm font-medium text-gray-300 mb-2">
              {t(locale, "settings.diceSides")}
            </label>
            <input
              id="diceSides"
              type="number"
              min={2}
              max={1000000}
              value={form.diceSides}
              onChange={(e) => setForm((f) => ({ ...f, diceSides: Number(e.target.value) }))}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Each &quot;roll&quot; is a random number from 0 to diceSides−1.
            </p>
          </div>
          <div>
            <label htmlFor="shareTarget" className="block text-sm font-medium text-gray-300 mb-2">
              {t(locale, "settings.shareTarget")}
            </label>
            <input
              id="shareTarget"
              type="number"
              min={1}
              max={form.diceSides}
              value={form.shareTarget}
              onChange={(e) => setForm((f) => ({ ...f, shareTarget: Number(e.target.value) }))}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Roll &lt; share target → valid share. (Easier = more shares.)
            </p>
          </div>
          <div>
            <label htmlFor="blockTarget" className="block text-sm font-medium text-gray-300 mb-2">
              {t(locale, "settings.blockTarget")}
            </label>
            <input
              id="blockTarget"
              type="number"
              min={0}
              max={form.shareTarget}
              value={form.blockTarget}
              onChange={(e) => setForm((f) => ({ ...f, blockTarget: Number(e.target.value) }))}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Roll &lt; block target → block found (and share). Must be ≤ share target.
            </p>
          </div>
          <button
            type="submit"
            className="min-h-[48px] px-6 py-3 rounded-xl bg-bitcoin-orange text-bitcoin-dark font-heading font-semibold hover:bg-bitcoin-orange-light transition-colors shadow-glow"
          >
            {saved ? t(locale, "settings.saved") : t(locale, "settings.save")}
          </button>
        </form>
      </div>

      <div className="pt-4 border-t border-bitcoin-border">
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="min-h-[48px] px-4 py-2.5 rounded-xl border border-red-800/60 text-red-400 hover:bg-red-950/40 hover:border-red-700/60 disabled:opacity-50 transition-colors"
        >
          {t(locale, "settings.resetWorkshop")}
        </button>
      </div>
    </div>
  );
}
