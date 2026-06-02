import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { forgotPassword } from "../../api/auth.api";
import { useForm } from "react-hook-form";
import ResetPasswordPage from "./ResetPassword";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");

  const [canReset, setCanReset] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSendOtp = async (data) => {
    try {
      setLoading(true);
      const res = await forgotPassword({ email: data.email });
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      let err = "";
      if (error?.response?.data?.errors) {
        err = Object.values(error?.response?.data?.errors)[0];
      } else {
        err = error?.response?.data?.message;
      }
      setError(err ?? "Something went wrong");
    }
  };

  if (canReset) {
    return <ResetPasswordPage />;
  }

  return (
    <div className="w-full max-w-md space-y-8 m-auto h-screen max-sm:p-5">
      <div className="space-y-2">
        <h2 className=" text-center my-5 font-['Playfair_Display'] text-3xl font-bold text-slate-900 ">
          Forgot Password
        </h2>

        <p className="text-center text-slate-500 dark:text-slate-400">
          Enter your email address and we'll send a verification code to reset
          your password.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl">
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-black">!</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid Email Address",
                },
              })}
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700- text-slate-900 dark:text-white- bg-white dark:bg-slate-800- placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs my-2">
              {errors?.email?.message || "Something went wrong"}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-all"
        >
          Send Verification Code
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/login"
          className="  inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
