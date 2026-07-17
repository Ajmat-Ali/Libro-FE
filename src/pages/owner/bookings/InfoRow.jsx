function InfoRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p
          className={`text-sm font-semibold mt-0.5 ${accent ? "text-amber-600 dark:text-amber-400" : "text-slate-800 dark:text-white"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default InfoRow;
