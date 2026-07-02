const SummaryBar = ({ summary }) => {
  if (!summary) return null;

  const pills = [
    {
      key: "available",
      label: "Available",
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "booked",
      label: "Booked",
      color: "bg-red-500/15 text-red-600 dark:text-red-400",
    },
    {
      key: "expiringSoon",
      label: "Expiring Soon",
      color: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    },
    {
      key: "maintenance",
      label: "Maintenance",
      color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    },
    {
      key: "reserved",
      label: "Reserved",
      color: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    },
    {
      key: "disabled",
      label: "Disabled",
      color: "bg-slate-500/15 text-slate-500 dark:text-slate-400",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-center mr-1">
        {summary.total} seats
      </span>

      {pills.map(({ key, label, color }) => {
        if (!summary[key]) return null;
        return (
          <span
            key={key}
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${color}`}
          >
            {summary[key]} {label}
          </span>
        );
      })}
    </div>
  );
};

export default SummaryBar;
