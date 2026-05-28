import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { addWalkInMember } from "../../../api/owner.api";

// Live preview card
const MemberPreview = ({ firstName, lastName, email, phone }) => {
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
  const hasName = firstName || lastName;

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-xl mb-6">
      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold text-lg">
        {hasName ? initials : <User className="w-5 h-5" />}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-white truncate">
          {hasName
            ? `${firstName || ""} ${lastName || ""}`.trim()
            : "Member Name"}
        </p>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {email || "email@example.com"}
        </p>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          {phone || "Phone number"}
        </p>
      </div>
      <div className="ml-auto flex-shrink-0">
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
          Auto Approved
        </span>
      </div>
    </div>
  );
};

const AddWalkInDrawer = ({ onClose, onSuccess }) => {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch fields for live preview
  const [firstName, lastName, email, phone] = watch([
    "firstName",
    "lastName",
    "email",
    "phone",
  ]);

  // Close on Escape key
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
      await addWalkInMember({
        firstName: data.firstName.trim(),
        lastName: data.lastName?.trim() || "",
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        address: data.address?.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to add member. Try again.",
      );
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900
     dark:text-white bg-white dark:bg-slate-800/80 placeholder-slate-400
     outline-none transition-all
     ${
       hasError
         ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
         : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
     }`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 "
      />

      {/* Drawer */}
      <div className=" fixed right-0 top-0 h-full w-full sm:w-[440px] bg-slate-50 dark:bg-slate-900 z-50 flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-700 animate-[slideInRight_0.3s_ease-out]">
        {" "}
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
              Add Walk-in Member
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Account auto-approved · Password emailed automatically
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Live preview */}
          <MemberPreview
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
          />

          {serverError && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form
            id="walkInForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                  First Name *
                </label>
                <input
                  placeholder="First name"
                  {...register("firstName", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 chars" },
                  })}
                  className={inputClass(errors.firstName)}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Last Name
                </label>
                <input
                  placeholder="Last name"
                  {...register("lastName")}
                  className={inputClass(false)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                Email *
              </label>
              <input
                type="email"
                placeholder="member@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
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
                className={inputClass(errors.phone)}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                Address
                <span className="text-slate-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <textarea
                rows={2}
                placeholder="Home address"
                {...register("address")}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                🔑 A random password will be auto-generated and emailed to the
                member. They can change it after first login.
              </p>
            </div>
          </form>
        </div>
        {/* Sticky footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-xl transition-all text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="walkInForm"
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
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
              "Add Member"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddWalkInDrawer;
