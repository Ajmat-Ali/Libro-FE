import { MapPin, Clock, Calendar, Layers } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";

const SEAT_TYPE_STYLES = {
  general: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  vip: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  window: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  cabin: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-700/60 last:border-0">
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
      <Icon size={15} />
      {label}
    </div>
    <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
      {value}
    </div>
  </div>
);

const BookingInfoCard = ({ booking }) => {
  const seatType = booking.seatId?.seatType;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
        Booking Details
      </h3>

      <Row
        icon={MapPin}
        label="Seat"
        value={
          <span className="flex items-center gap-1.5">
            {booking.seatId?.seatLabel}
            {seatType && (
              <span
                className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  SEAT_TYPE_STYLES[seatType] || SEAT_TYPE_STYLES.general
                }`}
              >
                {seatType}
              </span>
            )}
          </span>
        }
      />
      <Row
        icon={Clock}
        label="Time Slot"
        value={`${booking.timeSlotId?.name} · ${booking.timeSlotId?.startTimeDisplay} - ${booking.timeSlotId?.endTimeDisplay}`}
      />
      <Row icon={Layers} label="Plan" value={booking.planId?.name} />
      <Row
        icon={Calendar}
        label="Valid Period"
        value={`${formatDate(booking.startDate)} – ${formatDate(booking.endDate)}`}
      />
    </div>
  );
};

export default BookingInfoCard;
