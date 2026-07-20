import { useEffect, useState } from "react";
import { X, MapPin, Clock, IndianRupee, Calendar, Loader2 } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";
import { getAllPLans, initiateStudentBooking } from "../../../api/student.api";
import { useNavigate } from "react-router-dom";
import loadRazorpayScript from "../../../utils/loadRazorpayScript";
import { LIBRARY_NAME } from "../../../constant";

const SEAT_TYPE_STYLES = {
  general: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  vip: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  window: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  cabin: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

const STAGE = {
  IDLE: "idle",
  PROCESSING: "processing", // creating order, opening checkout
  CONFIRMING: "confirming", // payment done in popup, waiting a beat before redirect
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

  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  const [stage, setStage] = useState(STAGE.IDLE);
  const [error, setError] = useState("");

  const { seat } = seatData;
  const slot = slotData[0].raw;
  const floor = floorData[0].raw;

  const handleBookAndPay = async () => {
    setSubmitting(true);
    setError("");
    setStage(STAGE.PROCESSING);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError(
          "Could not load payment gateway. Check your internet connection and try again.",
        );
        setStage(STAGE.IDLE);
        return;
      }

      const res = await initiateStudentBooking({
        seatId: seat._id,
        timeSlotId: slot._id,
        startDate: selectedDate,
      });
      const { order, razorpayKeyId, bookingPreview } = res.data;

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: LIBRARY_NAME,
        description: `Seat ${bookingPreview.seatLabel} · ${bookingPreview.slotName}`,
        theme: { color: "#F59E0B" },

        handler: () => {
          setStage(STAGE.CONFIRMING);
          setTimeout(() => {
            navigate("/student/dashboard");
          }, 2500);
        },

        modal: {
          ondismiss: () => {
            setStage(STAGE.IDLE);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setStage(STAGE.IDLE);
      });

      rzp.open();

      //-------
    } catch (err) {
      let errorMessage = "Something went wrong";
      console.log(err.response.data?.errors);
      if (err?.response.data?.errors) {
        errorMessage = Object.values(err.response.data?.errors)[0];
      } else {
        errorMessage = Object.values(err.response.data?.message);
      }
      setError(errorMessage);
      setStage(STAGE.IDLE);
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

  if (stage === STAGE.CONFIRMING) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 text-center max-w-xs mx-4">
          <Loader2 size={32} className="animate-spin text-amber-500 mx-auto" />
          <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
            Payment received — confirming your booking...
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            This usually takes a few seconds
          </p>
        </div>
      </div>
    );
  }

  const isProcessing = stage === STAGE.PROCESSING;

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
          //   <button
          //     onClick={handleConfirm}
          //     disabled={submitting}
          //     className="cursor-pointer w-full mt-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium text-sm py-3 rounded-xl transition flex items-center justify-center gap-2"
          //   >
          //     {submitting ? (
          //       <>
          //         <Loader2 size={16} className="animate-spin" />
          //         Processing...
          //       </>
          //     ) : (
          //       "Book & Pay"
          //     )}
          //   </button>
          <button
            onClick={handleBookAndPay}
            disabled={isProcessing}
            className="w-full mt-5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium text-sm py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Opening payment...
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
