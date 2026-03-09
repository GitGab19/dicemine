"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale, t } from "@/lib/translations";

export function Layout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function href(path: string) {
    return `${path}?lang=${locale}`;
  }

  const navLink =
    "text-gray-400 hover:text-bitcoin-orange transition-colors font-medium";
  const activeNav = "text-white";
  const isMiner = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const isSettings = pathname === "/settings";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpen]);

  const navContent = (
    <>
      <Link href={href("/")} className={isMiner ? activeNav : navLink}>
        {t(locale, "nav.miner")}
      </Link>
      <Link href={href("/dashboard")} className={isDashboard ? activeNav : navLink}>
        {t(locale, "nav.dashboard")}
      </Link>
      <Link href={href("/settings")} className={isSettings ? activeNav : navLink}>
        {t(locale, "nav.settings")}
      </Link>
      <span className="text-bitcoin-border hidden md:inline">|</span>
      <Link href={`${pathname || "/"}?lang=en`} className={`text-lg ${navLink}`} aria-label={t(locale, "lang.en")} title={t(locale, "lang.en")}>
        <span aria-hidden>🇬🇧</span>
      </Link>
      <Link href={`${pathname || "/"}?lang=it`} className={`text-lg ${navLink}`} aria-label={t(locale, "lang.it")} title={t(locale, "lang.it")}>
        <span aria-hidden>🇮🇹</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <header className="border-b border-bitcoin-border bg-bitcoin-surface/95 backdrop-blur-sm sticky top-0 z-20 shadow-card">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href={href("/")}
            className="text-lg sm:text-xl font-heading font-bold text-bitcoin-orange hover:text-bitcoin-orange-light transition-colors tracking-tight shrink-0"
          >
            {t(locale, "app.title")}
          </Link>
          <div className="flex items-center gap-4" ref={menuRef}>
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navContent}
            </nav>
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex flex-col justify-center gap-1.5 w-10 h-10 min-h-[44px] min-w-[44px] rounded-lg border border-bitcoin-border bg-bitcoin-dark/80 text-gray-300 hover:text-white hover:bg-bitcoin-dark focus:outline-none focus:ring-2 focus:ring-bitcoin-orange"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={`w-5 h-0.5 bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-5 h-0.5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-0.5 bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
        {/* Mobile dropdown nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-bitcoin-border bg-bitcoin-surface animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-3 py-4 flex flex-col gap-1">
              <Link href={href("/")} className={`min-h-[44px] flex items-center px-3 rounded-lg hover:bg-bitcoin-dark/50 py-2 text-base font-medium ${isMiner ? activeNav : navLink}`}>
                {t(locale, "nav.miner")}
              </Link>
              <Link href={href("/dashboard")} className={`min-h-[44px] flex items-center px-3 rounded-lg hover:bg-bitcoin-dark/50 py-2 text-base font-medium ${isDashboard ? activeNav : navLink}`}>
                {t(locale, "nav.dashboard")}
              </Link>
              <Link href={href("/settings")} className={`min-h-[44px] flex items-center px-3 rounded-lg hover:bg-bitcoin-dark/50 py-2 text-base font-medium ${isSettings ? activeNav : navLink}`}>
                {t(locale, "nav.settings")}
              </Link>
              <div className="border-t border-bitcoin-border my-2" />
              <div className="flex gap-2 px-3">
                <Link href={`${pathname || "/"}?lang=en`} className={`flex-1 min-h-[44px] flex items-center justify-center rounded-lg border border-bitcoin-border text-2xl hover:bg-bitcoin-dark/50 ${navLink}`} aria-label={t(locale, "lang.en")} title={t(locale, "lang.en")}>
                  <span aria-hidden>🇬🇧</span>
                </Link>
                <Link href={`${pathname || "/"}?lang=it`} className={`flex-1 min-h-[44px] flex items-center justify-center rounded-lg border border-bitcoin-border text-2xl hover:bg-bitcoin-dark/50 ${navLink}`} aria-label={t(locale, "lang.it")} title={t(locale, "lang.it")}>
                  <span aria-hidden>🇮🇹</span>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-6 sm:py-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
