import { useEffect, useState } from "react";
import { X, MapPin, Clock, IndianRupee, Calendar, Loader2 } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import { getAllPLans } from "../../../api/student.api";

const SEAT_TYPE_STYLES = {
  general: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  vip: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  window: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  cabin: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

const BookSeatModal = ({
  seat: seatData,
  slot: slotData,
  floor: floorData,
  selectedDate,
  onClose,
  onConfirm,
}) => {
  const [submitting, setSubmitting] = useState(false);

  if (!seatData) return null;

  //   console.log(seatData.gridStatus);

  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  const { seat } = seatData;
  const slot = slotData[0].raw;
  const floor = floorData[0].raw;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm({
        seatId: seat._id,
        timeSlotId: slot._id,
        startDate: selectedDate,
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setPlanLoading(true);
        const res = await getAllPLans();

        const allPlans = res?.data?.plans;

        setPlan(
          allPlans.filter((plan) => {
            return (
              plan.seatType === seat.seatType &&
              plan.timeSlotId._id === slot._id
            );
          }),
        );
        setPlanLoading(false);
        setPlanError("");
      } catch (error) {
        setPlanError(error?.response?.data?.message);
      } finally {
        setPlanLoading(false);
      }
    };
    fetchPlan();
  }, [seat.seatType, slot._id]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={submitting ? undefined : onClose}
      />

      <div className="relative w-full md:max-w-sm bg-white dark:bg-slate-800 rounded-t-3xl md:rounded-2xl p-5 animate-in slide-in-from-bottom md:zoom-in duration-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
                Seat {seat.seatLabel}
              </h3>
              <span
                className={`text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  SEAT_TYPE_STYLES[seat.seatType] || SEAT_TYPE_STYLES.general
                }`}
              >
                {seat.seatType}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="cursor-pointer p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Clock size={15} className="text-amber-500 shrink-0" />
            {slot.name} · {slot.startTimeDisplay} - {slot.endTimeDisplay}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Calendar size={15} className="text-amber-500 shrink-0" />
            Starts {formatDate(selectedDate)} · valid 30 days
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <MapPin size={15} className="text-amber-500 shrink-0" />
            Floor {floor.name || ""}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Monthly price
          </span>
          <span className="flex items-center text-xl font-semibold text-slate-900 dark:text-white">
            <IndianRupee size={17} />
            {plan ? plan[0].calculatedPrice : "—"}
          </span>
        </div>

        {seatData.gridStatus === "available" ? (
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="cursor-pointer w-full mt-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium text-sm py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Book & Pay"
            )}
          </button>
        ) : (
          <button
            disabled
            className="mt-5 flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-red-300 bg-red-500 py-3 text-sm font-semibold text-white opacity-40 shadow-none"
          >
            This Seat Is Already {seatData.gridStatus}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookSeatModal;

// Fetch the Plan to show Price and then click on pay to razor pay payment
