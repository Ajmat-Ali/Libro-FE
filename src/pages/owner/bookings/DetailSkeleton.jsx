function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4">
        <div className="h-1.5 rounded bg-slate-200 dark:bg-slate-700 w-full" />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-700 rounded" />
          </div>
        </div>
        <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
      </div>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 space-y-4"
          >
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-700 rounded" />
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 w-16 bg-slate-100 dark:bg-slate-700 rounded" />
                  <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailSkeleton;
