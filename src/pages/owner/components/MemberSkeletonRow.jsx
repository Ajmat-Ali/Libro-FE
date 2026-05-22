const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28" />
          <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-36" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3.5">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
    </td>
    <td className="px-4 py-3.5">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-28" />
    </td>
  </tr>
);

export default SkeletonRow;
