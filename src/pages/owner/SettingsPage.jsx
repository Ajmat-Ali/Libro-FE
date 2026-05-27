import { useState } from "react";
import {
  Building2,
  Clock,
  IndianRupee,
  CalendarOff,
  Shield,
} from "lucide-react";
import LibraryInfoSection from "./settings/LibraryInfoSection";
import TimingsSection from "./settings/TimingsSection";
import HourlyRatesSection from "./settings/HourlyRatesSection";
import HolidaysSection from "./settings/HolidaysSection";
import GuardsSection from "./settings/guard/GuardSection";

const TABS = [
  { key: "library", label: "Library Info", icon: Building2 },
  { key: "timings", label: "Timings & Days", icon: Clock },
  { key: "rates", label: "Hourly Rates", icon: IndianRupee },
  { key: "holidays", label: "Holidays", icon: CalendarOff },
  { key: "guards", label: "Guard Accounts", icon: Shield },
];

export default function SettingsPage() {
  const [active, setActive] = useState("library");

  const SECTION = {
    library: <LibraryInfoSection />,
    timings: <TimingsSection />,
    rates: <HourlyRatesSection />,
    holidays: <HolidaysSection />,
    guards: <GuardsSection />,
  };

  return (
    <div className="p-5 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your library configuration
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ── Sidebar tabs (desktop) / Horizontal scroll (mobile) ── */}
        <aside className="md:w-56 shrink-0">
          {/* Mobile: horizontal scroll */}
          <div className="flex md:hidden gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((t) => {
              const Icon = t.icon;
              const on = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                    on
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Desktop: vertical sidebar */}
          <nav className="hidden md:flex flex-col gap-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-2 shadow-sm">
            {TABS.map((t) => {
              const Icon = t.icon;
              const on = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                    on
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${on ? "text-white" : "text-slate-400"}`}
                  />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Section content ── */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm min-h-[500px]">
            {SECTION[active]}
          </div>
        </main>
      </div>
    </div>
  );
}
