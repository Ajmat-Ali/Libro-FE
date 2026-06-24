import { useEffect, useState } from "react";
import {
  X,
  AlertTriangle,
  CheckCircle,
  Banknote,
  User,
  Calendar,
} from "lucide-react";
import { recordCashPayment } from "../../../api/owner.api";

const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function RecordCashDrawer({ payment, onClose, onSuccess }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleConfirm = async () => {
    setConfirming(true);
    setError("");
    try {
      await recordCashPayment(payment._id);
      onSuccess();
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again";
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setConfirming(false);
    }
  };

  const studentName = `${payment.studentId.firstName} ${payment.studentId.lastName}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[440px] h-full bg-white dark:bg-slate-800 flex flex-col shadow-xl animate-slideInRight">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Record Cash Payment
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mark that you have received cash
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div className="text-center py-6 bg-slate-50 dark:bg-slate-700/40 rounded-2xl">
            <Banknote className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {fmt(payment.amount)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Cash payment from {studentName}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <User className="w-3.5 h-3.5" /> Member
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {studentName}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> Booking ends
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {fmtDate(payment.bookingId?.endDate)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Only confirm if you have physically received{" "}
              <strong>{fmt(payment.amount)}</strong> in cash from this member.
              This action cannot be undone.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {confirming ? (
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {confirming ? "Recording…" : "Confirm Cash Received"}
          </button>
          <button
            onClick={onClose}
            disabled={confirming}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
