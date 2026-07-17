import {
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Ban,
  ArrowRight,
  Link2,
  Armchair,
} from "lucide-react";

import DurationBar from "./DurationBar";
import daysLeft from "./daysLeft";
import fmtDate from "./fmtDate";
import InfoRow from "./InfoRow";
import TrailSection from "./TrailSection";

const STATUS_CONFIG = {
  active: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    label: "Active",
  },
  pending: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    label: "Pending",
  },
  expired: {
    bg: "bg-slate-100 dark:bg-slate-700/50",
    text: "text-slate-500 dark:text-slate-400",
    dot: "bg-slate-400",
    label: "Expired",
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Cancelled",
  },
  rejected: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    label: "Rejected",
  },
};

const PAYMENT_CONFIG = {
  paid: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    label: "Paid",
    icon: CheckCircle2,
  },
  pending: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    label: "Pending",
    icon: AlertCircle,
  },
};

export function fmtDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.expired;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// function TrailSection({ booking }) {
//   const items = [];

//   if (booking.extendedFrom)
//     items.push({
//       icon: Link2,
//       label: "Renewed from previous booking",
//       time: null,
//       color: "text-purple-500",
//     });
//   if (booking.approvedBy && booking.approvedAt)
//     items.push({
//       icon: CheckCircle2,
//       label: "Booking approved",
//       time: booking.approvedAt,
//       color: "text-emerald-500",
//     });
//   if (booking.rejectedBy && booking.rejectedAt)
//     items.push({
//       icon: XCircle,
//       label: `Rejected — ${booking.rejectionReason ?? "no reason"}`,
//       time: booking.rejectedAt,
//       color: "text-red-500",
//     });
//   if (booking.cancelledBy && booking.cancelledAt)
//     items.push({
//       icon: Ban,
//       label: `Cancelled — ${booking.cancelReason ?? "no reason given"}`,
//       time: booking.cancelledAt,
//       color: "text-red-500",
//     });

//   items.push({
//     icon: Calendar,
//     label: "Booking created",
//     time: booking.createdAt,
//     color: "text-slate-400",
//   });

//   if (items.length === 0) return null;

//   return (
//     <div>
//       <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
//         Timeline
//       </p>
//       <div className="space-y-3">
//         {items.map((item, i) => {
//           const Icon = item.icon;
//           return (
//             <div key={i} className="flex items-start gap-3">
//               <Icon className={`w-4 h-4 ${item.color} shrink-0 mt-0.5`} />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm text-slate-700 dark:text-slate-300">
//                   {item.label}
//                 </p>
//                 {item.time && (
//                   <p className="text-xs text-slate-400 mt-0.5">
//                     {fmtDateTime(item.time)}
//                   </p>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

export default function BookingDetailCard({
  booking,
  payment,
  onCancel,
  onExtend,
  onRebook,
}) {
  if (!booking) return null;

  const student = booking?.studentId ?? {};
  const seat = booking?.seatId ?? {};
  const slot = booking?.timeSlotId ?? {};
  const plan = booking?.planId ?? {};
  const days = booking?.status === "active" ? daysLeft(booking.endDate) : null;
  const pmtCfg = payment
    ? (PAYMENT_CONFIG[payment.status] ?? PAYMENT_CONFIG.pending)
    : null;
  const PmtIcon = pmtCfg?.icon ?? AlertCircle;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xl font-black text-amber-700 dark:text-amber-400 shrink-0">
                {(student.firstName?.[0] ?? "?").toUpperCase()}
                {(student.lastName?.[0] ?? "?").toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
                  {student.firstName} {student.lastName}
                </p>
                <p className="text-sm text-slate-400">{student.email}</p>
                {student.phone && (
                  <p className="text-xs text-slate-400">{student.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={booking.status} />
              {payment && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${pmtCfg.bg} ${pmtCfg.text}`}
                >
                  <PmtIcon className="w-3.5 h-3.5" />
                  {pmtCfg.label}
                </span>
              )}
            </div>
          </div>

          {booking.status === "active" && (
            <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
              <DurationBar
                startDate={booking.startDate}
                endDate={booking.endDate}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left — Seat & Slot */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Seat & Slot
          </p>
          <InfoRow
            icon={Armchair}
            label="Seat"
            value={`${seat.seatLabel ?? "—"} · ${seat.seatType ? seat.seatType.charAt(0).toUpperCase() + seat.seatType.slice(1) : ""}`}
            accent
          />
          <InfoRow
            icon={Clock}
            label="Time Slot"
            value={
              slot.name
                ? `${slot.name} (${slot.startTimeDisplay} – ${slot.endTimeDisplay})`
                : "—"
            }
          />
          <InfoRow icon={MapPin} label="Plan" value={plan.name ?? "—"} />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Billing
          </p>
          <InfoRow
            icon={Calendar}
            label="Start Date"
            value={fmtDate(booking.startDate)}
          />
          <InfoRow
            icon={Calendar}
            label="End Date"
            value={fmtDate(booking.endDate)}
          />
          <InfoRow
            icon={CreditCard}
            label="Monthly Fee"
            value={`₹${booking.price}`}
            accent
          />
          {payment?.paidAt && (
            <InfoRow
              icon={CheckCircle2}
              label="Paid On"
              value={fmtDate(payment.paidAt)}
            />
          )}
          {payment?.paymentMode && (
            <InfoRow
              icon={CreditCard}
              label="Payment Mode"
              value={
                payment.paymentMode === "cash"
                  ? "Cash (Manual)"
                  : "Online (Razorpay)"
              }
            />
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
        <TrailSection booking={booking} />
      </div>

      {(booking.status === "active" ||
        booking.status === "expired" ||
        booking.status === "cancelled") && (
        <div className="flex flex-wrap gap-3 ">
          {booking.status === "active" && (
            <>
              <button
                onClick={onExtend}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-bold transition-all shadow-sm shadow-amber-200 dark:shadow-none"
              >
                <RefreshCw className="w-4 h-4" />
                Renew Booking
              </button>
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 text-sm font-semibold transition-all"
              >
                <Ban className="w-4 h-4" />
                Cancel Booking
              </button>
            </>
          )}
          {(booking.status === "expired" || booking.status === "cancelled") && (
            <button
              onClick={onRebook}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-bold transition-all shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Re-book for this student
            </button>
          )}
        </div>
      )}
    </div>
  );
}
