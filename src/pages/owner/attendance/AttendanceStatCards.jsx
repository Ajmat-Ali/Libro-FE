import { Users, CheckCircle, XCircle } from "lucide-react";

function StatCard({ icon: Icon, label, value, colorClass, bgClass }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${bgClass}`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{value ?? "—"}</p>
    </div>
  );
}

export default function AttendanceStatCards({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700" />
              <div className="h-3 w-20 bg-slate-100 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-7 w-12 bg-slate-100 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-2">
      <StatCard
        icon={Users}
        label="Total booked"
        value={summary?.total}
        colorClass="text-slate-700 dark:text-slate-300"
        bgClass="bg-slate-100 dark:bg-slate-700"
      />
      <StatCard
        icon={CheckCircle}
        label="Present"
        value={summary?.present}
        colorClass="text-emerald-600 dark:text-emerald-400"
        bgClass="bg-emerald-50 dark:bg-emerald-500/10"
      />
      <StatCard
        icon={XCircle}
        label="Absent"
        value={summary?.absent}
        colorClass="text-red-500 dark:text-red-400"
        bgClass="bg-red-50 dark:bg-red-500/10"
      />
    </div>
  );
}
