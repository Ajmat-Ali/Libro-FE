import { useState } from "react";

import { Ban } from "lucide-react";

function CancelModal({ booking, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  const student = booking?.studentId ?? {};
  const seat = booking?.seatId ?? {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
            <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Cancel Booking
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {student.firstName} {student.lastName} — Seat{" "}
              <strong>{seat.seatLabel}</strong>
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          This will immediately cancel the booking and{" "}
          <span className="font-medium text-red-600 dark:text-red-400">
            revoke the student's QR code
          </span>
          . They will no longer be able to enter the library with this booking.
        </p>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Reason <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Student requested cancellation, moving to different slot..."
          rows={2}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-white resize-none placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {loading ? "Cancelling…" : "Cancel Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;
