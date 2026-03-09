"use client";

import { useEffect, useState } from "react";
import { type Locale, t } from "@/lib/translations";
import { SettingsClient } from "@/components/SettingsClient";

export function SettingsGate({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/settings")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.authenticated ? "unlocked" : "locked");
      })
      .catch(() => setStatus("locked"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok && data.authenticated) {
      setStatus("unlocked");
    } else {
      setError(t(locale, "settings.wrongPassword"));
    }
  }

  if (status === "loading") {
    return (
      <p className="text-gray-400 font-medium">Loading…</p>
    );
  }

  if (status === "locked") {
    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-bitcoin-surface border border-bitcoin-border rounded-xl sm:rounded-2xl p-6 shadow-card">
          <p className="text-gray-300 text-center mb-6">
            {t(locale, "settings.passwordPrompt")}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t(locale, "settings.passwordPlaceholder")}
              className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-bitcoin-dark border border-bitcoin-border text-white placeholder-gray-500 focus:ring-2 focus:ring-bitcoin-orange focus:border-bitcoin-orange"
              autoFocus
              autoComplete="current-password"
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full min-h-[48px] py-3 rounded-xl bg-bitcoin-orange text-bitcoin-dark font-heading font-semibold hover:bg-bitcoin-orange-light transition-colors"
            >
              {t(locale, "settings.unlock")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <SettingsClient locale={locale} />;
}
