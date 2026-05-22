import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateMember } from "../../../api/owner.api";

const UpdateMemberDrawer = ({ member, onClose, onSuccess }) => {
  const [serverError, setServerError] = useState("");
  const user = member?.userId || member;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: member?.phone || "",
      address: member?.address || "",
    },
  });

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const onSubmit = async (data) => {
    try {
      setServerError("");
      await updateMember(member._id, {
        firstName: data.firstName.trim(),
        lastName: data.lastName?.trim() || "",
        phone: data.phone.trim(),
        address: data.address?.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to update member. Try again.",
      );
    }
  };

  // Field class — amber border highlight on changed fields
  const inputClass = (fieldName, hasError) => `
    w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900
    dark:text-white bg-white dark:bg-slate-800/80 placeholder-slate-400
    outline-none transition-all
    ${
      hasError
        ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
        : dirtyFields[fieldName]
          ? "border-amber-400 dark:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5"
          : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
    }
  `;

  const changedCount = Object.keys(dirtyFields).length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-[440px]
                      bg-slate-50 dark:bg-slate-900 z-50 flex flex-col
                      shadow-2xl border-l border-slate-200 dark:border-slate-700
                      animate-[slideInRight_0.3s_ease-out]"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5
                        border-b border-slate-200 dark:border-slate-700
                        bg-white dark:bg-slate-800"
        >
          <div>
            <h2
              className="font-bold text-slate-900 dark:text-white
                           font-['Playfair_Display']"
            >
              Edit Member
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.firstName} {user?.lastName || ""}
              {changedCount > 0 && (
                <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                  · {changedCount} field{changedCount > 1 ? "s" : ""} changed
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                       hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {serverError && (
            <div
              className="p-3 mb-4 bg-red-50 dark:bg-red-500/10 border
                            border-red-200 dark:border-red-500/20 rounded-xl
                            text-red-600 dark:text-red-400 text-sm"
            >
              {serverError}
            </div>
          )}

          {changedCount > 0 && (
            <div
              className="p-3 mb-4 bg-amber-50 dark:bg-amber-500/10 border
                            border-amber-200 dark:border-amber-500/20 rounded-xl"
            >
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Highlighted fields have been modified
              </p>
            </div>
          )}

          <form
            id="updateMemberForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="text-xs font-medium text-slate-600
                                  dark:text-slate-400 mb-1.5 block"
                >
                  First Name *
                </label>
                <input
                  placeholder="First name"
                  {...register("firstName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 chars" },
                  })}
                  className={inputClass("firstName", errors.firstName)}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="text-xs font-medium text-slate-600
                                  dark:text-slate-400 mb-1.5 block"
                >
                  Last Name
                </label>
                <input
                  placeholder="Last name"
                  {...register("lastName")}
                  className={inputClass("lastName", false)}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                className="text-xs font-medium text-slate-600
                                dark:text-slate-400 mb-1.5 block"
              >
                Phone *
              </label>
              <input
                placeholder="10-digit mobile number"
                maxLength={10}
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid Indian mobile number",
                  },
                })}
                className={inputClass("phone", errors.phone)}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                className="text-xs font-medium text-slate-600
                                dark:text-slate-400 mb-1.5 block"
              >
                Address
                <span className="text-slate-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Home address"
                {...register("address")}
                className={`${inputClass("address", false)} resize-none`}
              />
            </div>

            {/* Email — read only, not editable */}
            <div>
              <label
                className="text-xs font-medium text-slate-600
                                dark:text-slate-400 mb-1.5 block"
              >
                Email
                <span className="text-slate-400 font-normal ml-1">
                  (cannot be changed)
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm
                           text-slate-400 dark:text-slate-500 bg-slate-100
                           dark:bg-slate-800 border-slate-200 dark:border-slate-700
                           cursor-not-allowed"
              />
            </div>
          </form>
        </div>

        {/* Sticky footer */}
        <div
          className="px-6 py-4 border-t border-slate-200 dark:border-slate-700
                        bg-white dark:bg-slate-800 flex gap-3"
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700
                       text-slate-700 dark:text-slate-300 hover:bg-slate-50
                       dark:hover:bg-slate-700 font-medium rounded-xl
                       transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="updateMemberForm"
            disabled={isSubmitting || changedCount === 0}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600
                       disabled:bg-slate-200 dark:disabled:bg-slate-700
                       disabled:text-slate-400 dark:disabled:text-slate-500
                       disabled:cursor-not-allowed text-slate-900 font-semibold
                       rounded-xl transition-all text-sm flex items-center
                       justify-center gap-2"
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
            ) : changedCount === 0 ? (
              "No changes"
            ) : (
              `Save ${changedCount} Change${changedCount > 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateMemberDrawer;
