function StatCard({ icon: Icon, label, value, count, color }) {
  // --------------------- Place count somewhere -------------------

  return (
    <div className=" bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${color.bg}`}>
          <Icon className={`w-4 h-4 ${color.icon}`} />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className={`text-2xl font-bold ${color.text}`}>
        {value ?? (
          <span className="inline-block h-7 w-24 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
        )}
      </div>
      {count ? (
        <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          Total {count}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default StatCard;
