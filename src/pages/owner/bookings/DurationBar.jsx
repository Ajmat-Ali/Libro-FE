import daysLeft from "./daysLeft";
import fmtDate from "./fmtDate";
function DurationBar({ startDate, endDate }) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const total = end - start;

  const elapsed = Math.max(0, Math.min(now - start, total));

  const pct = total > 0 ? Math.round((elapsed / total) * 100) : 0;

  const days = daysLeft(endDate);
  const isExpired = days <= 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-xs">
        <span className="text-slate-400">{fmtDate(startDate)} </span>
        <span
          className={`font-semibold ${isExpired ? "text-red-500" : days <= 7 ? "text-amber-500" : "text-emerald-500"}`}
        >
          {isExpired ? "Expired" : `${days} days left`}
        </span>
        <span className="text-slate-400">{fmtDate(endDate)}</span>
      </div>
      <div className=" h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isExpired
              ? "bg-red-400"
              : days <= 7
                ? "bg-amber-400"
                : "bg-emerald-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-xs text-slate-400 mt-1">
        {pct}% elapsed · 30-day plan
      </p>
    </div>
  );
}

export default DurationBar;
