const PlaceholderPage = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-4">
      <Icon className="text-amber-500" size={28} />
    </div>
    <h2 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
      {title}
    </h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs">
      {description}
    </p>
    <span className="mt-4 inline-block text-[11px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full">
      Coming soon
    </span>
  </div>
);

export default PlaceholderPage;
