import { Eye, EyeOff, ImagePlus, ShieldCheck, Upload } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmiting },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const inputClass =
    "w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/80 placeholder-slate-400 outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10";

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
            First Name *
          </label>

          <input
            type="text"
            placeholder="Enter first name"
            className={inputClass}
            {...register("firstName", {
              required: { value: true, message: "First name is required" },
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
              maxLength: {
                value: 20,
                message: "First name cannot exceed 20 characters",
              },
            })}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
            Last Name
          </label>

          <input
            type="text"
            placeholder="Enter last name"
            className={inputClass}
            {...register("lastName", {
              maxLength: {
                value: 20,
                message: "Last name cannot exceed 20 characters",
              },
            })}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
          Email Address *
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          className={inputClass}
          {...register("email", {
            required: { value: true, message: "Email is required" },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
          Password *
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create strong password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
              },
            })}
            className={`${inputClass} pr-11`}
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
          >
            {showPassword ? (
              <EyeOff className="w-4.5 h-4.5" />
            ) : (
              <Eye className="w-4.5 h-4.5" />
            )}
          </button>
        </div>

        {errors.password ? (
          <p>{errors.password.message}</p>
        ) : (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Use at least 8 characters with numbers & symbols
          </div>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
          Phone Number *
        </label>

        <input
          type="tel"
          placeholder="10-digit mobile number"
          className={inputClass}
          maxLength={10}
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: "Enter a valid Indian mobile number",
            },
          })}
        />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
          Address
        </label>

        <textarea
          rows={3}
          placeholder="Enter your address"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        {/* Photo Upload */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
            Profile Photo *
          </label>

          <label className="group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white dark:bg-slate-800/60 hover:bg-amber-50/40 dark:hover:bg-amber-500/5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ImagePlus className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Upload profile photo
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              PNG, JPG up to 5MB
            </p>

            <input type="file" className="hidden" />
          </label>
        </div>

        {/* ID Proof Upload */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
            ID Proof *
          </label>

          <label className="group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white dark:bg-slate-800/60 hover:bg-amber-50/40 dark:hover:bg-amber-500/5">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Upload ID proof
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Aadhaar, PAN, Voter ID, Driving Licence, etc.
            </p>

            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
        <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
          Your account details and uploaded documents are securely protected.
          Verification may take a few moments after registration.
        </p>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
        />

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          I agree to the{" "}
          <button
            type="button"
            className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            Terms & Conditions
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            Privacy Policy
          </button>
          .
        </p>
      </div>

      {/* Register Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-900 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
      >
        Create Account
      </button>

      {/* Login redirect */}
      <div className="text-center pt-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;
