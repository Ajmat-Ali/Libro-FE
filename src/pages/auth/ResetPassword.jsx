import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { resetPassword } from "../../api/auth.api";
import ResetPasswordSuccess from "./ResetPasswordSuccess";
import ResendButton from "./ResendButton";

export default function ResetPasswordPage({ email }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [flag, setFlag] = useState(false);
  const [secs, setSecs] = useState(5);

  const [canResend, setCanResend] = useState(false);
  const [secLeft, setSecLeft] = useState(10);
  const [resendLoading, setResetLoading] = useState(false);
  const [resendError, setResendError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onChange" });

  const newPasswordValue = watch("newPassword");

  const handleReset = async (data) => {
    try {
      setLoading(true);

      const res = await resetPassword({ ...data, email });
      if (res.status === 200) {
        setLoading(false);
        setServerError("");
        setFlag(true);
      }
    } catch (error) {
      setLoading(false);
      let err;
      if (error?.response?.data?.errors) {
        err = Object.values(error?.response?.data?.errors)[0];
      } else if (error?.response?.data?.message) {
        err = error?.response?.data?.message;
      } else {
        err = "Something went wrong !";
      }
      setServerError(err);
    }
  };

  useEffect(() => {
    if (!flag) {
      return;
    }
    let id = setInterval(() => {
      setSecs((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [flag]);

  if (flag) {
    return <ResetPasswordSuccess flag={flag} secs={secs} />;
  }

  useEffect(() => {
    let id = setInterval(() => {
      setSecLeft((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  console.log(secLeft);

  return (
    <div className="w-full max-w-md space-y-8 m-auto h-screen max-sm:p-5">
      <div className="space-y-2">
        <h2 className="text-center my-5 font-['Playfair_Display'] text-3xl font-bold text-slate-900 ">
          Reset Password
        </h2>

        <p className="text-center text-slate-500 dark:text-slate-400">
          Enter the verification code sent to your email{" "}
          <span className="text-green-800 font-bold"> {email} </span>
          and choose a new password.
        </p>
      </div>

      {serverError && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl">
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-black">!</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleReset)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Verification Code
          </label>

          <input
            type="text"
            {...register("otp", {
              required: { value: true, message: "OTP is required" },
              maxLength: {
                value: 6,
                message: "OTP must be exact 6 character number",
              },
              minLength: {
                value: 6,
                message: "OTP must be exact 6 character number",
              },
            })}
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center tracking-[0.5em] text-lg font-semibold bg-white  text-slate-900  outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
          {errors.otp && (
            <p className="text-xs text-red-500">{errors.otp.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ">
            New Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              {...register("newPassword", {
                required: { value: true, message: "New Password is required" },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
                },
              })}
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
          {errors.newPassword && (
            <p className="text-xs text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ">
            Confirm Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Confirm Password is required",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                  message:
                    "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
                },
                validate: (value) => {
                  return (
                    value === newPasswordValue ||
                    "Password must match with new Password"
                  );
                },
              })}
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
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-all"
        >
          {isSubmitting ? (
            <div className="flex justify-center items-center gap-x-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
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
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>

              <span>Resetting...</span>
            </div>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* <div className="text-center text-sm">
          <button
            type="button"
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Resend Code
          </button>
        </div> */}
      </form>

      <ResendButton />

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
