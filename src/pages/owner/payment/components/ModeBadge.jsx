import { Banknote, Smartphone } from "lucide-react";

export function ModeBadge({ mode }) {
  if (mode === "online")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
        <Smartphone className="w-3 h-3" />
        Online
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
      <Banknote className="w-3 h-3" />
      Cash
    </span>
  );
}

export default ModeBadge;
