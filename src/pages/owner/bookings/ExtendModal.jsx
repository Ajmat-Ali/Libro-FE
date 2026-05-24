import { useState } from "react";
import { RefreshCw } from "lucide-react";
import fmtDate from "./fmtDate";

function ExtendModal({ booking, onClose, onConfirm, loading }) {
  // Default start = day after current booking ends
  const defaultStart = booking?.endDate
    ? new Date(new Date(booking.endDate).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const endDate = startDate
    ? new Date(new Date(startDate).getTime() + 30 * 86400000)
        .toISOString()
        .split("T")[0]
    : "";

  const student = booking?.studentId ?? {};
  const seat = booking?.seatId ?? {};
  const slot = booking?.timeSlotId ?? {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Renew Booking
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {student.firstName} — <strong>{seat.seatLabel}</strong> ·{" "}
              {slot.name}
            </p>
          </div>
        </div>

        {/* Current booking info banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-xl px-4 py-2.5 mb-4 text-sm text-amber-800 dark:text-amber-300">
          Current booking ends <strong>{fmtDate(booking?.endDate)}</strong>. A
          fresh booking record will be created for the new period.
        </div>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          New Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 mb-4"
        />

        {/* Summary row */}
        {endDate && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl mb-4 text-center text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Starts</p>
              <p className="font-semibold text-slate-800 dark:text-white text-xs">
                {fmtDate(startDate)}
              </p>
            </div>
            <div className="border-x border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400 mb-0.5">Ends</p>
              <p className="font-semibold text-slate-800 dark:text-white text-xs">
                {fmtDate(endDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Fee</p>
              <p className="font-bold text-amber-600 dark:text-amber-400">
                ₹{booking?.price}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(startDate)}
            disabled={loading || !startDate}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            {loading ? "Renewing…" : "Confirm Renewal"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExtendModal;
