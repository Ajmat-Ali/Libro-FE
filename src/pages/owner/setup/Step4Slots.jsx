import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { setCurrentStep, clearWizard } from "../../../store/slices/wizardSlice";
import { createSlot } from "../../../api/owner.api";
import { timeToMinutes, formatTimeDisplay } from "../../../utils/timeUtils";

const Step4Slots = () => {
  const [createdSlots, setCreatedSlots] = useState([]);
  const [serverError, setServerError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const libraryId = useSelector((store) => store.wizard.libraryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onAddSlot = async (data) => {
    try {
      setServerError("");

      const payload = {
        libraryId,
        name: data.name.trim(),
        startTime: data.startTime,
        endTime: data.endTime,
      };

      const response = await createSlot(payload);

      setCreatedSlots((prev) => [
        ...prev,
        {
          _id: response.slot._id,
          name: response.slot.name,
          startTimeDisplay: response.slot.startTimeDisplay,
          endTimeDisplay: response.slot.endTimeDisplay,
          durationMinutes: response.slot.durationMinutes,
        },
      ]);
      reset();
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to add slot. Try again.",
      );
    }
  };

  const handleFinish = () => {
    dispatch(clearWizard());
    navigate("/owner/dashboard", { replace: true });
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900
     dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400
     outline-none transition-all
     ${
       hasError
         ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
         : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
     }`;

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Add Time Slots
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create your library's time slots. Plans are auto-generated from your
          hourly rates.
        </p>
      </div>

      {/* Add slot form */}
      <form
        onSubmit={handleSubmit(onAddSlot)}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4"
      >
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          New Slot
        </h3>

        {serverError && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Slot Name *
          </label>
          <input
            placeholder="e.g. Morning, Evening, Full Day"
            {...register("name", {
              required: "Slot name is required",
              minLength: {
                value: 2,
                message: "Slot name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Slot name cannot exceed 50 characters",
              },
            })}
            className={inputClass(errors.name)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Start Time *
            </label>
            <input
              type="time"
              {...register("startTime", { required: "Start time is required" })}
              className={inputClass(errors.startTime)}
            />
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              End Time *
            </label>
            <input
              type="time"
              {...register("endTime", { required: "End time is required" })}
              className={inputClass(errors.endTime)}
            />
            {errors.endTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400">
          If end time is next day (e.g. 10PM → 6AM), that's handled
          automatically.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
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
              Adding...
            </>
          ) : (
            "+ Add Slot"
          )}
        </button>
      </form>

      {/* Created slots */}
      {createdSlots.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Created ({createdSlots.length})
          </p>
          {createdSlots.map((slot) => (
            <div
              key={slot._id}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
            >
              <div className="w-9 h-9 bg-amber-50 dark:bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {slot.name}
                </p>
                <p className="text-xs text-slate-500">
                  {slot.startTimeDisplay} – {slot.endTimeDisplay}
                </p>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                {formatDuration(slot.durationMinutes)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Plans info note */}
      {createdSlots.length > 0 && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            ✓ Plans auto-created for all seat types with hourly rates set
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep(3))}
          className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold rounded-xl transition-all text-sm"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleFinish}
          disabled={createdSlots.length === 0}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm"
        >
          {createdSlots.length === 0
            ? "Add at least 1 slot"
            : "🎉 Finish Setup"}
        </button>
      </div>
    </div>
  );
};

export default Step4Slots;
