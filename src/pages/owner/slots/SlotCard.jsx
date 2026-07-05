import { Clock, Pencil, Trash2 } from "lucide-react";

function fmtDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function SlotCard({ slot, onEdit, onDelete }) {
  return (
    <div
      className="border-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 
        flex items-center gap-4 flex-wrap hover:border-slate-200 dark:hover:border-slate-600 transition-colors max-sm:flex-col max-sm:gap-y-5 "
    >
      <div className=" w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
        <Clock className="w-5 h-5 text-amber-500" />
      </div>

      <div className="flex-1 min-w-0 max-sm:text-center">
        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
          {slot.name}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {slot.startTimeDisplay} - {slot.endTimeDisplay}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {fmtDuration(slot.durationMinutes)} duration
        </p>
      </div>

      <div className=" flex-shrink-0">
        {slot.isActive ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Inactive
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 ">
        <button
          onClick={() => onEdit(slot)}
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          aria-label={`Edit ${slot.name}`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(slot)}
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 transition-all"
          aria-label={`Delete ${slot.name}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
