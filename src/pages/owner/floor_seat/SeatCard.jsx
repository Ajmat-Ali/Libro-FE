const STATUS_CONFIG = {
  available: {
    light: "bg-green-50 border-green-400 text-green-700 hover:bg-green-100",
    dark: "dark:bg-green-900/20 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/40",
    dot: "bg-green-400",
    label: "Available",
  },
  booked: {
    light: "bg-red-50 border-red-400 text-red-700 hover:bg-red-100",
    dark: "dark:bg-red-900/20 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-900/40",
    dot: "bg-red-400",
    label: "Booked",
  },
  expiring_soon: {
    light: "bg-orange-50 border-orange-400 text-orange-700 hover:bg-orange-100",
    dark: "dark:bg-orange-900/20 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-orange-900/40",
    dot: "bg-orange-400",
    label: "Expiring",
  },
  maintenance: {
    light: "bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100",
    dark: "dark:bg-yellow-900/20 dark:border-yellow-500 dark:text-yellow-400 dark:hover:bg-yellow-900/40",
    dot: "bg-yellow-400",
    label: "Maintenance",
  },
  reserved: {
    light: "bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100",
    dark: "dark:bg-yellow-900/20 dark:border-yellow-500 dark:text-yellow-400 dark:hover:bg-yellow-900/40",
    dot: "bg-yellow-400",
    label: "Reserved",
  },
  disabled: {
    light: "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed",
    dark: "dark:bg-slate-800 dark:border-slate-600 dark:text-slate-500 cursor-not-allowed",
    dot: "bg-slate-300",
    label: "Disabled",
  },
};

const SeatCard = ({ item, onClick }) => {
  const { seat, gridStatus, dayLeft } = item;

  const config = STATUS_CONFIG[gridStatus] || STATUS_CONFIG.available;

  const isClickable = gridStatus !== "disabled";

  return (
    <button
      onClick={() => isClickable && onClick(item)}
      disabled={!isClickable}
      title={`${seat.seatLabel} — ${config.label}`}
      className={`
        relative flex flex-col items-center justify-center
        h-16 w-16 rounded-lg border-2 transition-all duration-200
        select-none focus:outline-none focus:ring-2 focus:ring-amber-400
        ${config.light} ${config.dark}
        ${isClickable ? "cursor-pointer active:scale-95" : ""}
      `}
    >
      <span className="font-semibold text-sm font-[DM_Sans]">
        {seat.seatLabel}
      </span>

      <span className="text-[10px] capitalize opacity-70 mt-0.5">
        {seat.seatType}
      </span>

      {gridStatus === "expiring_soon" && dayLeft !== null && (
        <span
          className="
          absolute -top-2 -right-2
          bg-orange-500 text-white
          text-[9px] font-bold
          px-1.5 py-0.5 rounded-full
          leading-none
        "
        >
          {dayLeft}d
        </span>
      )}

      <span
        className={`
        absolute bottom-1.5
        w-1.5 h-1.5 rounded-full
        ${config.dot}
      `}
      />
    </button>
  );
};

export default SeatCard;
