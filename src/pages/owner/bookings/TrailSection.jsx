import { Ban, Calendar, CheckCircle2, Link2, XCircle } from "lucide-react";
import { fmtDateTime } from "./BookingDetailCard";

function TrailSection({ booking }) {
  const items = [];

  if (booking.extendedFrom)
    items.push({
      icon: Link2,
      label: "Renewed from previous booking",
      time: null,
      color: "text-purple-500",
    });
  if (booking.approvedBy && booking.approvedAt)
    items.push({
      icon: CheckCircle2,
      label: "Booking approved",
      time: booking.approvedAt,
      color: "text-emerald-500",
    });
  if (booking.rejectedBy && booking.rejectedAt)
    items.push({
      icon: XCircle,
      label: `Rejected — ${booking.rejectionReason ?? "no reason"}`,
      time: booking.rejectedAt,
      color: "text-red-500",
    });
  if (booking.cancelledBy && booking.cancelledAt)
    items.push({
      icon: Ban,
      label: `Cancelled — ${booking.cancelReason ?? "no reason given"}`,
      time: booking.cancelledAt,
      color: "text-red-500",
    });

  items.push({
    icon: Calendar,
    label: "Booking created",
    time: booking.createdAt,
    color: "text-slate-400",
  });

  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
        Timeline
      </p>
      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <Icon className={`w-4 h-4 ${item.color} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {item.label}
                </p>
                {item.time && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {fmtDateTime(item.time)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrailSection;
