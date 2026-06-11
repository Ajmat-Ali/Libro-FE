import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { updateSeat } from "../../../../api/owner.api";

const seatTypes = [
  { value: "general", label: "General" },
  { value: "vip", label: "VIP" },
  { value: "window", label: "Window" },
  { value: "cabin", label: "Cabin" },
];

const inputClass = (isDirty) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm
   text-slate-900 dark:text-white bg-white dark:bg-slate-800/80
   placeholder-slate-400 outline-none transition-all
   ${
     isDirty
       ? "border-amber-400 dark:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5"
       : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
   }`;

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

const EditSeatSection = ({ seat, floorId, isOpen, onToggle, onSuccess }) => {
  const [seatLabel, setSeatLabel] = useState(seat.seatLabel);
  const [seatType, setSeatType] = useState(seat.seatType);
  const [description, setDescription] = useState(seat.description || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const labelChanged = seatLabel.trim() !== seat.seatLabel;
  const typeChanged = seatType !== seat.seatType;
  const descriptionChanged = description.trim() !== (seat.description || "");

  const hasChanges = labelChanged || typeChanged || descriptionChanged;

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updateSeat({
        seatId: seat._id,
        floorId: floorId,
        data: { seatLabel, seatType, description },
      });
      setLoading(false);
      setError("");
      onSuccess();
    } catch (error) {
      setLoading(false);
      let serverErr = "Something went wrong";
      if (error?.response?.data?.errors) {
        serverErr = Object.values(error?.response?.data?.errors)[0];
      } else {
        serverErr = error?.response?.data?.message;
      }
      setError(serverErr);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
      >
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Edit Seat Details
          </span>
          {hasChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          )}
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

          {hasChanges && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Highlighted fields have been modified
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                Seat Label
              </label>
              <input
                value={seatLabel}
                onChange={(e) => setSeatLabel(e.target.value.toUpperCase())}
                maxLength={10}
                placeholder="e.g. A1"
                className={inputClass(labelChanged)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                Type
              </label>
              <select
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
                className={inputClass(typeChanged)}
              >
                {seatTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Description
              <span className="text-slate-400 font-normal ml-1">
                (optional)
              </span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              placeholder="e.g. Near window, corner seat"
              className={inputClass(descriptionChanged)}
            />
          </div>

          {hasChanges && (
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
                "Save Changes"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditSeatSection;
