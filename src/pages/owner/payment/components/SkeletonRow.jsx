function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default SkeletonRow;
