import { CheckCircle2, Clock, XCircle, Ban } from "lucide-react";

const CONFIG = {
  active: {
    icon: CheckCircle2,
    label: "Active Booking",
    style:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  },
  pending: {
    icon: Clock,
    label: "Awaiting Approval",
    style:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  },
  expired: {
    icon: XCircle,
    label: "Expired",
    style:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600",
  },
  cancelled: {
    icon: Ban,
    label: "Cancelled",
    style:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
  },
  rejected: {
    icon: Ban,
    label: "Rejected",
    style:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
  },
};

const BookingStatusBanner = ({ status }) => {
  const config = CONFIG[status] || CONFIG.expired;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-medium ${config.style}`}
    >
      <Icon size={16} />
      {config.label}
    </div>
  );
};

export default BookingStatusBanner;
