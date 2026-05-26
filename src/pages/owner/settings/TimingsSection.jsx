import { useState } from "react";
import { useSelector } from "react-redux";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateLibrary } from "../../../api/owner.api";
import useToast from "./useToast";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const inputCls =
  "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors";

export function TimingsSection() {
  const library = useSelector((s) => s.library ?? null);

  const [openingTime, setOpeningTime] = useState(
    library?.timings?.openingTime ?? "06:00",
  );
  const [closingTime, setClosingTime] = useState(
    library?.timings?.closingTime ?? "22:00",
  );
  const [workingDays, setWorkingDays] = useState(
    library?.workingDays ?? DAYS.slice(0, 6),
  );
  const [saving, setSaving] = useState(false);
  const [toast, showToast] = useToast();

  const toggleDay = (day) =>
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  const handleSave = async () => {
    if (workingDays.length === 0) {
      showToast("error", "Select at least one working day");
      return;
    }
    setSaving(true);
    try {
      await updateLibrary({
        timings: {
          openingTime,
          closingTime,
          openingTimeMinutes: toMinutes(openingTime),
          closingTimeMinutes: toMinutes(closingTime),
        },
        workingDays,
      });
      showToast("success", "Timings updated successfully");
    } catch (err) {
      showToast("error", err.response?.data?.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Timings & Working Days
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Controls when students can make bookings
        </p>
      </div>

      {/* Time pickers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Opening Time
          </label>
          <input
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Closing Time
          </label>
          <input
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Working days */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Working Days
          <span className="ml-2 text-xs text-slate-400 font-normal">
            ({workingDays.length} selected)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day, i) => {
            const on = workingDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  on
                    ? "bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-200 dark:shadow-none"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {SHORT[i]}
              </button>
            );
          })}
        </div>
        {workingDays.length === 0 && (
          <p className="text-xs text-red-500 mt-2">
            At least one day must be selected
          </p>
        )}
      </div>

      {/* Current summary */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
        <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
          Library is open {openingTime} – {closingTime} on{" "}
          {workingDays.length === 7
            ? "all days"
            : workingDays.map((d) => d.slice(0, 3)).join(", ")}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        {toast && (
          <div
            className={`flex items-center gap-2 text-sm font-medium ${toast.type === "success" ? "text-emerald-600" : "text-red-500"}`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.msg}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default TimingsSection;
