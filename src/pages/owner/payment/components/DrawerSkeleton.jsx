function DrawerSkeleton() {
  return (
    <div className="px-5 py-5 space-y-5 animate-pulse">
      <div className="h-24 bg-slate-100 dark:bg-slate-700 rounded-2xl" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-20 bg-slate-100 dark:bg-slate-700 rounded" />
          <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default DrawerSkeleton;
