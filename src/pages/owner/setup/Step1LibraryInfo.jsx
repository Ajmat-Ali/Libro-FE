import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setCurrentStep,
  setLibraryId,
} from "../../../store/slices/wizardSlice";
import { createLibrary } from "../../../api/owner.api";
import { timeToMinutes } from "../../../utils/timeUtils";
import { DAYS, SEAT_TYPES } from "../../../constant";
import { inputClass } from "../../../utils/inputClass";
import { ToastContainer, toast } from "react-toastify";

const Step1LibraryInfo = () => {
  const [selectedDays, setSelectedDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [serverError, setServerError] = useState("");
  const [serverFormError, setServerFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      hourlyRates: { general: 0, vip: 0, window: 0, cabin: 0 },
    },
  });

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const onSubmit = async (data) => {
    if (selectedDays.length === 0) {
      setServerError("Please select at least one working day.");
      return;
    }

    try {
      setServerError("");
      setServerFormError("");

      const payload = {
        ...data,
        workingDays: selectedDays,
        timings: {
          ...data.timings,
        },
        hourlyRates: {
          general: Number(data.hourlyRates.general) || 0,
          vip: Number(data.hourlyRates.vip) || 0,
          window: Number(data.hourlyRates.window) || 0,
          cabin: Number(data.hourlyRates.cabin) || 0,
        },
      };

      const response = await createLibrary(payload);

      toast.success("Library created successfully!");

      dispatch(setLibraryId(response.library._id));
      dispatch(setCurrentStep(2));
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Library Information
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Set up your library's basic details
        </p>
      </div>

      {serverError && (
        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {serverError}
        </div>
      )}

      {/* ------------------------- BASIC INFO -------------------------*/}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Basic Info
        </h3>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Library Name *
          </label>
          <input
            placeholder="e.g. City Central Library"
            {...register("name", {
              required: "Library name is required",
              minLength: {
                value: 3,
                message: "Library name must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Library name cannot exceed 100 characters",
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
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief description of your library (optional)"
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description cannot exceed 500 characters",
              },
            })}
            className={`${inputClass(errors.description)} resize-none`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* ----------------------- ADDRESS ------------------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Address
        </h3>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Street *
          </label>
          <input
            placeholder="Street address"
            {...register("address.street", {
              required: "Street is required",
              maxLength: {
                value: 200,
                message: "Street cannot exceed 200 characters",
              },
            })}
            className={inputClass(errors.address?.street)}
          />
          {errors.address?.street && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.street.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              City *
            </label>
            <input
              placeholder="City"
              {...register("address.city", {
                required: "City is required",
                maxLength: {
                  value: 50,
                  message: "City cannot exceed 50 characters",
                },
              })}
              className={inputClass(errors.address?.city)}
            />
            {errors.address?.city && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.city.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              State *
            </label>
            <input
              placeholder="State"
              {...register("address.state", {
                required: "State is required",
                maxLength: {
                  value: 50,
                  message: "State cannot exceed 50 characters",
                },
              })}
              className={inputClass(errors.address?.state)}
            />
            {errors.address?.state && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.state.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Pincode *
          </label>
          <input
            placeholder="6-digit pincode"
            maxLength={6}
            {...register("address.pincode", {
              required: "Pincode is required",
              pattern: {
                value: /^[1-9][0-9]{5}$/,
                message: "Enter a valid 6-digit pincode",
              },
            })}
            className={inputClass(errors.address?.pincode)}
          />
          {errors.address?.pincode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.pincode.message}
            </p>
          )}
        </div>
      </div>

      {/* -------------------------------- CONTACT -------------------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Contact
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Phone *
            </label>
            <input
              placeholder="10-digit mobile"
              maxLength={10}
              {...register("contact.phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid Indian mobile number",
                },
              })}
              className={inputClass(errors.contact?.phone)}
            />
            {errors.contact?.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Email *
            </label>
            <input
              type="email"
              placeholder="contact@library.com"
              {...register("contact.email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              className={inputClass(errors.contact?.email)}
            />
            {errors.contact?.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
            Website
          </label>
          <input
            placeholder="https://yourlibrary.com (optional)"
            {...register("contact.website")}
            className={inputClass(false)}
          />
        </div>
      </div>

      {/* ----------------------------- TIMINGS ----------------------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Timings
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Opening Time *
            </label>
            <input
              type="time"
              {...register("timings.openingTime", {
                required: "Opening time is required",
              })}
              className={inputClass(errors.timings?.openingTime)}
            />
            {errors.timings?.openingTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.timings.openingTime.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Closing Time *
            </label>
            <input
              type="time"
              {...register("timings.closingTime", {
                required: "Closing time is required",
              })}
              className={inputClass(errors.timings?.closingTime)}
            />
            {errors.timings?.closingTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.timings.closingTime.message}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400">
          If closing time is past midnight (e.g. 6AM next day), that's handled
          automatically.
        </p>
      </div>

      {/* ----------------------------- WORKING DAYS --------------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Working Days
        </h3>

        <div className="flex flex-wrap gap-2 ">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                ${
                  selectedDays.includes(day)
                    ? "bg-amber-500 text-slate-900"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {selectedDays.length === 0 && (
          <p className="text-red-500 text-xs">
            Select at least one working day
          </p>
        )}
      </div>

      {/* --------------------------------- HOURLY RATES ----------------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Hourly Rates (₹)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Plans are auto-created from these rates. Seat types with ₹0 rate
            won't have plans created. You can update anytime from Settings.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SEAT_TYPES.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                {label} Seat
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register(`hourlyRates.${key}`, { min: 0 })}
                  className={`${inputClass(false)} pl-7`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------ NEXT BUTTON ----------------------------- */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
            Saving...
          </>
        ) : (
          "Save & Continue →"
        )}
      </button>
    </form>
  );
};

export default Step1LibraryInfo;
