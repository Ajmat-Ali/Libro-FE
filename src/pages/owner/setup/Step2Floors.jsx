import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Trash2 } from "lucide-react";
import { setCurrentStep, addFloor } from "../../../store/slices/wizardSlice";
import { createFloor } from "../../../api/owner.api";

const Step2Floors = () => {
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();
  const libraryId = useSelector((state) => state.wizard.libraryId);
  const createdFloors = useSelector((state) => state.wizard.createdFloors);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onAddFloor = async (data) => {
    try {
      setServerError("");
      const response = await createFloor({
        libraryId,
        name: data.name.trim(),
        number: Number(data.number),
        description: data.description?.trim() || undefined,
      });
      dispatch(
        addFloor({
          _id: response.floor._id,
          name: response.floor.name,
          number: response.floor.number,
        }),
      );
      reset();
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to add floor. Try again.",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Add Floors
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add all floors of your library. You can add more later.
        </p>
      </div>

      {/* Add floor form */}
      <form
        onSubmit={handleSubmit(onAddFloor)}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4"
      >
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          New Floor
        </h3>

        {serverError && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Floor Name *
            </label>
            <input
              placeholder="e.g. Ground Floor"
              {...register("name", {
                required: "Floor name is required",
                minLength: {
                  value: 2,
                  message: "Floor name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Floor name cannot exceed 50 characters",
                },
              })}
              className={inputClass(errors.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Floor Number *
            </label>
            <input
              type="number"
              min="0"
              placeholder="0 = Ground"
              {...register("number", {
                required: "Floor number is required",
                min: { value: 0, message: "Cannot be negative" },
              })}
              className={inputClass(errors.number)}
            />
            {errors.number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.number.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Description
          </label>
          <input
            placeholder="Optional note about this floor"
            {...register("description", {
              maxLength: {
                value: 200,
                message: "Description cannot exceed 200 characters",
              },
            })}
            className={inputClass(false)}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
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
            "+ Add Floor"
          )}
        </button>
      </form>

      {/* Created floors list */}
      {createdFloors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Created ({createdFloors.length})
          </p>
          {createdFloors.map((floor) => (
            <div
              key={floor._id}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
            >
              <div className="w-9 h-9 bg-amber-50 dark:bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {floor.name}
                </p>
                <p className="text-xs text-slate-500">Floor {floor.number}</p>
              </div>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                Added ✓
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch(setCurrentStep(3))}
          disabled={createdFloors.length === 0}
          className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm"
        >
          {createdFloors.length === 0 ? "Add at least 1 floor" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default Step2Floors;
