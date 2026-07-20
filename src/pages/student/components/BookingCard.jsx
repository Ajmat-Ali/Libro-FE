import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import PaymentBadge from "./PaymentBadge";

import { formatDate } from "../../../utils/dateUtils";

const SEAT_TYPE_STYLES = {
  general: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  vip: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  window: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  cabin: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

const BookingCard = ({ booking }) => {
  const {
    bookingId,
    seat,
    slot,
    endDate,
    daysLeft,
    expiringSoon,
    payment,
    attendedToday,
  } = booking;

  const seatLabel = seat.seatLabel;
  const seatType = seat.seatType;

  return (
    <Link
      to={`/student/bookings/${bookingId}`}
      className={`group flex items-center gap-4 rounded-2xl border bg-white dark:bg-slate-800 p-4 transition hover:shadow-md hover:border-amber-200 dark:hover:border-amber-500/30 ${
        expiringSoon
          ? "border-amber-300 dark:border-amber-500/40"
          : "border-slate-100 dark:border-slate-700"
      }`}
    >
      <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
        <MapPin size={18} className="text-amber-500" />
      </div>

      <div className=" flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-900 dark:text-white text-sm">
            Seat {seatLabel}
          </span>
          {seatType && (
            <span
              className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
                SEAT_TYPE_STYLES[seatType] || SEAT_TYPE_STYLES.general
              }`}
            >
              {seatType}
            </span>
          )}
          {attendedToday && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
              <CheckCircle2 size={12} />
              Present
            </span>
          )}
        </div>

        {slot && (
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-1">
            <Clock size={12} />
            {slot.name} · {slot.time}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <PaymentBadge status={payment.status} />
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {daysLeft} {daysLeft === 1 ? "day" : "days"} left · till{" "}
            {formatDate(endDate)}
          </span>
        </div>

        {expiringSoon && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1.5 rounded-lg w-fit">
            <AlertTriangle size={13} />
            Expiring soon
          </div>
        )}
      </div>

      <ChevronRight
        size={18}
        className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition shrink-0"
      />
    </Link>
  );
};

export default BookingCard;
