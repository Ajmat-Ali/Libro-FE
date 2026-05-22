import { useState } from "react";

const RejectModal = ({ member, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState("");

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm "
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700">
        {/* Header */}
        <div className="space-y-1 mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
            Reject Member
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You are rejecting{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {member?.userId?.firstName} {member?.userId?.lastName}
            </span>
          </p>
        </div>

        {/* Reason input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600  dark:text-slate-400 block">
            Reason for rejection *
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Incomplete documents, Invalid ID proof..."
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-slate-400 outline-none border-slate-200 dark:border-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-xl transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim() || isLoading}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-500/40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
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
                Rejecting...
              </>
            ) : (
              "Confirm Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
