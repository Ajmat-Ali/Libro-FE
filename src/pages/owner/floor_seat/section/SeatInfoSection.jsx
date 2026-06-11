const gridStatusConfig = {
  available: {
    label: "Available",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  booked: {
    label: "Booked",
    badge: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
  expiring_soon: {
    label: "Expiring Soon",
    badge: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
  maintenance: {
    label: "Maintenance",
    badge: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  },
  reserved: {
    label: "Reserved",
    badge: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  },
  disabled: {
    label: "Disabled",
    badge: "bg-slate-500/15 text-slate-500 dark:text-slate-400",
  },
};

const SeatInfoSection = ({ seat, gridStatus }) => {
  const config = gridStatusConfig[gridStatus] || gridStatusConfig.disabled;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
      <div className=" flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
            {seat.seatLabel}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${config.badge}`}
          >
            {config.label}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/50">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Type
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
            {seat.seatType}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/50">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Physical status
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">
            {seat.status}
          </span>
        </div>

        {seat.description && (
          <div className="flex items-start justify-between py-1.5">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Note
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 max-w-[200px] text-right">
              {seat.description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatInfoSection;
