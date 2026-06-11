import { useState } from "react";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { updateSeatStatus } from "../../../../api/owner.api";

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const statusOptions = [
  { value: "active", label: "Active", desc: "Open for new bookings" },
  {
    value: "maintenance",
    label: "Maintenance",
    desc: "Temporarily unavailable",
  },
  { value: "reserved", label: "Reserved", desc: "Held by owner" },
  {
    value: "disabled",
    label: "Disabled",
    desc: "Permanently removed from map",
  },
];

const StatusSection = ({ seat, floorId, isOpen, onToggle, onSuccess }) => {
  const [newStatus, setNewStatus] = useState(seat.status);
  const [statusReason, setStatusReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasChanged = newStatus !== seat.status;

  const handleSave = async () => {
    try {
      setLoading(true);
      const data = { status: newStatus, reason: statusReason };
      const res = await updateSeatStatus(floorId, seat._id, data);
      setLoading(false);
      setError("");
      onSuccess();
    } catch (error) {
      setLoading(false);
      let serverError = "Something went wrong";
      if (error?.response?.data?.errors) {
        serverError = Object.values(error?.response?.data?.errors)[0];
      } else {
        serverError = error?.response?.data?.message;
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Change Status
          </span>

          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 capitalize">
            {seat.status}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-3">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setNewStatus(option.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all
                  ${
                    newStatus === option.value
                      ? "border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-500/5"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                    {option.label}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {option.desc}
                  </p>
                </div>
                {/* Selected indicator */}
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all
                  ${
                    newStatus === option.value
                      ? "border-amber-500 bg-amber-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                />
              </button>
            ))}
          </div>

          {hasChanged && (
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                Reason
                <span className="text-slate-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Chair broken, held for VIP member"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                maxLength={200}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm
                  text-slate-900 dark:text-white placeholder-slate-400
                  bg-white dark:bg-slate-800/80
                  border-slate-200 dark:border-slate-700
                  focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                  outline-none transition-all"
              />
            </div>
          )}

          {hasChanged && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600
                disabled:bg-amber-500/60 disabled:cursor-not-allowed
                text-slate-900 font-semibold rounded-xl
                transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Update Status"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusSection;
