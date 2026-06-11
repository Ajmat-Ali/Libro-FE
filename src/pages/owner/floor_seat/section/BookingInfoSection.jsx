import { User, Calendar, CreditCard, Clock, AlertTriangle } from "lucide-react";

const InfoRow = ({ icon: Icon, label, value, valueClass = "" }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
        <p
          className={`text-sm font-medium text-slate-900 dark:text-white mt-0.5 ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const BookingInfoSection = ({ bookingDetails, dayLeft, gridStatus }) => {
  if (!bookingDetails) return null;

  // Student name from populated studentId
  const studentName = bookingDetails.studentId
    ? `${bookingDetails.studentId.firstName} ${bookingDetails?.studentId?.lastName || ""}`.trim()
    : "—";

  const daysLeftClass =
    dayLeft !== null && dayLeft <= 3
      ? "text-red-600 dark:text-red-400"
      : "text-orange-600 dark:text-orange-400";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Current Booking
      </h3>

      {gridStatus === "expiring_soon" && dayLeft !== null && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl mb-3">
          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className={`text-sm font-semibold ${daysLeftClass}`}>
            Expires in {dayLeft} day{dayLeft !== 1 ? "s" : ""}
            {dayLeft === 0 ? " — expires today" : ""}
          </p>
        </div>
      )}

      <InfoRow icon={User} label="Student" value={studentName} />
      <InfoRow
        icon={Calendar}
        label="Booking Period"
        value={
          bookingDetails.startDate && bookingDetails.endDate
            ? `${formatDate(bookingDetails.startDate)} → ${formatDate(bookingDetails.endDate)}`
            : "—"
        }
      />

      {gridStatus === "booked" && dayLeft !== null && (
        <InfoRow
          icon={Clock}
          label="Days Remaining"
          value={`${dayLeft} days`}
        />
      )}
    </div>
  );
};

export default BookingInfoSection;
