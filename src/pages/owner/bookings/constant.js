const STATUS_CONFIG = {
  active: {
    label: "Active",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  expired: {
    label: "Expired",
    bg: "bg-slate-100 dark:bg-slate-700",
    text: "text-slate-500 dark:text-slate-400",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "expired", label: "Expired" },
  { key: "cancelled", label: "Cancelled" },
];

const daysLeft = (endDate) =>
  Math.ceil((new Date(endDate) - Date.now()) / 86400000);

export { STATUS_CONFIG, TABS, daysLeft };
