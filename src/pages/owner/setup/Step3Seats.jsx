import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/wizardSlice";
import { createSeat } from "../../../api/owner.api";

const SEAT_TYPES = ["general", "vip", "window", "cabin"];

const Step3Seats = () => {
  const [createdSeats, setCreatedSeats] = useState([]);
  const [serverError, setServerError] = useState("");

  const dispatch = useDispatch();
  const createdFloors = useSelector((state) => state.wizard.createdFloors);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { seatType: "general" },
  });

  const onAddSeat = async (data) => {
    try {
      setServerError("");
      const response = await createSeat(data.floorId, {
        seatLabel: data.seatLabel.toUpperCase().trim(),
        seatType: data.seatType,
        description: data.description?.trim() || undefined,
      });

      const floor = createdFloors.find((f) => f._id === data.floorId);
      setCreatedSeats((prev) => [
        ...prev,
        {
          _id: response.seat._id,
          seatLabel: response.seat.seatLabel,
          seatType: response.seat.seatType,
          floorName: floor?.name || "Unknown Floor",
        },
      ]);
      reset({ seatType: "general", floorId: data.floorId });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to add seat. Try again.",
      );
    }
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

  // Seat type badge colors
  const typeColor = {
    general:
      "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    vip: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    window: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
    cabin:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Add Seats
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add seats to your floors. Select the floor for each seat.
        </p>
      </div>

      {/* Add seat form */}
      <form
        onSubmit={handleSubmit(onAddSeat)}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4"
      >
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          New Seat
        </h3>

        {serverError && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {serverError}
          </div>
        )}

        {/* Floor dropdown */}
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Floor *
          </label>
          <select
            {...register("floorId", { required: "Select a floor" })}
            className={inputClass(errors.floorId)}
          >
            <option value="">Select floor</option>
            {createdFloors.map((floor) => (
              <option key={floor._id} value={floor._id}>
                {floor.name} (Floor {floor.number})
              </option>
            ))}
          </select>
          {errors.floorId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.floorId.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Seat label */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Seat Label *
            </label>
            <input
              placeholder="e.g. A1, B2"
              maxLength={10}
              {...register("seatLabel", {
                required: "Seat label is required",
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "Letters and numbers only",
                },
                maxLength: {
                  value: 4,
                  message: "SeatType cannot exceed 4 characters",
                },
              })}
              className={inputClass(errors.seatLabel)}
            />
            {errors.seatLabel && (
              <p className="text-red-500 text-xs mt-1">
                {errors.seatLabel.message}
              </p>
            )}
          </div>

          {/* Seat type */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Seat Type *
            </label>
            <select
              {...register("seatType", { required: true })}
              className={inputClass(errors.seatType)}
            >
              {SEAT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Description
          </label>
          <input
            placeholder="Optional note about this seat"
            {...register("description")}
            className={inputClass(false)}
          />
        </div>

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
            "+ Add Seat"
          )}
        </button>
      </form>

      {/* Created seats list */}
      {createdSeats.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Created ({createdSeats.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {createdSeats.map((seat) => (
              <div
                key={seat._id}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
              >
                <div className="w-9 h-9 bg-slate-900 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {seat.seatLabel}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {seat.floorName}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${typeColor[seat.seatType]}`}
                  >
                    {seat.seatType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep(2))}
          className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold rounded-xl transition-all text-sm"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep(4))}
          disabled={createdSeats.length === 0}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm"
        >
          {createdSeats.length === 0 ? "Add at least 1 seat" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default Step3Seats;
