import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteSeat } from "../../../../api/owner.api";
import SeatDeleteSuccess from "./SeatDeleteSuccess";

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

const DangerSection = ({ seat, floorId, onSuccess }) => {
  const [confirmStep, setConfirmStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successDelete, setSuccessDelete] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteSeat(floorId, seat._id);
      setTimeout(() => {
        setSuccessDelete(false);
        onSuccess();
      }, 3000);

      setLoading(false);
      setError("");
      setSuccessDelete(true);
    } catch (error) {
      setLoading(false);
      let serverError = "Something went wrong!";
      if (error?.response?.data?.errors) {
        serverError = Object.values(error?.response?.data?.errors)[0];
      } else {
        serverError = error?.response?.data?.message;
      }
      setError(serverError);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-red-100 dark:border-red-500/20">
      <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
        Danger Zone
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
        Deleting seat{" "}
        <strong className="text-slate-600 dark:text-slate-300">
          {seat.seatLabel}
        </strong>{" "}
        is permanent and cannot be undone.
      </p>

      {error && (
        <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {successDelete && (
        <SeatDeleteSuccess close={() => setSuccessDelete(false)} />
      )}

      {!confirmStep && (
        <button
          onClick={() => setConfirmStep(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all
            bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400
            hover:bg-red-100 dark:hover:bg-red-500/20
            border border-red-200 dark:border-red-500/30"
        >
          <Trash2 className="w-4 h-4" />
          Delete Seat
        </button>
      )}

      {confirmStep && (
        <div className="space-y-2">
          <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
            Are you sure? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setConfirmStep(false);
                setError("");
              }}
              disabled={loading || successDelete}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700
                text-slate-700 dark:text-slate-300 text-sm font-medium
                rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700
                transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || successDelete}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700
                disabled:opacity-60 disabled:cursor-not-allowed
                text-white text-sm font-semibold rounded-xl
                transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner /> Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerSection;
