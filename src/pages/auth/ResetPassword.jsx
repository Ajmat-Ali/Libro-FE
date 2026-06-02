import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8 m-auto h-screen max-sm:p-5">
      <div className="space-y-2">
        <h2 className="text-center my-5 font-['Playfair_Display'] text-3xl font-bold text-slate-900 ">
          Reset Password
        </h2>

        <p className="text-center text-slate-500 dark:text-slate-400">
          Enter the verification code sent to your email and choose a new
          password.
        </p>
      </div>

      <form className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Verification Code
          </label>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center tracking-[0.5em] text-lg font-semibold bg-white  text-slate-900  outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ">
            New Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200  bg-white  text-slate-900  outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-slate-400" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ">
            Confirm Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200  bg-white  text-slate-900  outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-slate-400" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-all"
        >
          Reset Password
        </button>

        <div className="text-center text-sm">
          <button
            type="button"
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Resend Code
          </button>
        </div>
      </form>

      <div className="text-center pb-7 ">
        <Link
          to="/login"
          className="text-sm text-slate-500 hover:text-slate-700  cursor-pointer"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
