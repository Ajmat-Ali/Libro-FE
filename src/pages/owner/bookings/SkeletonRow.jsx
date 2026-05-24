function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700/50">
      {[80, 55, 65, 70, 50, 60].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3.5 rounded animate-pulse bg-slate-100 dark:bg-slate-700/60"
            style={{ width: `${w}%` }}
          />
          {i === 0 && (
            <div
              className="h-2.5 rounded animate-pulse bg-slate-100 dark:bg-slate-700/40 mt-1.5"
              style={{ width: "50%" }}
            />
          )}
        </td>
      ))}
    </tr>
  );
}

export default SkeletonRow;
