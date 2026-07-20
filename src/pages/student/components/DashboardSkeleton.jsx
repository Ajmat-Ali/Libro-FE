const DashboardSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="h-32 rounded-3xl bg-slate-100 dark:bg-slate-800" />
    <div className="grid grid-cols-2 gap-3">
      <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
    </div>
    <div className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800" />
    <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
    <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
  </div>
);

export default DashboardSkeleton;
