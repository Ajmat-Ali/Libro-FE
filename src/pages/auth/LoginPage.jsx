import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, BookOpen, Sun, Moon } from "lucide-react";
import { setCredentials } from "../../store/slices/authSlice";
import { loginUser } from "../../api/auth.api";
import useDarkMode from "../../hooks/useDarkMode";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isDark, setIsDark] = useDarkMode();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const response = await loginUser(data);
      dispatch(
        setCredentials({
          user: response.userData,
          accessToken: response.accessToken,
        }),
      );
      if (response.userData.role === "owner") navigate("/owner/dashboard");
      else if (response.userData.role === "guard") navigate("/guard/scan");
      else navigate("/student/dashboard");
    } catch (error) {
      let err = "";
      if (error?.response?.data?.errors) {
        err = Object.values(error?.response?.data?.errors)[0];
      } else {
        err = error?.response?.data?.message;
      }

      setServerError(err || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex font-['DM_Sans'] bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 dark:bg-slate-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-slate-900" />
          </div>
          <span className="text-white text-xl font-semibold tracking-wide">
            Libro
          </span>
        </div>

        <div className="relative space-y-6">
          <h1 className="font-['Playfair_Display'] text-5xl font-bold text-white leading-tight">
            Smart Library
            <br />
            <span className="text-amber-400">Management</span>
            <br />
            System
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Manage seats, track attendance, and handle memberships — all in one
            place.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {["QR Entry", "Auto Attendance", "Analytics", "PDF Receipts"].map(
              (f) => (
                <span
                  key={f}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm"
                >
                  {f}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="relative">
          <p className="text-slate-500 text-sm">
            "A library is not a luxury but one of the necessities of life."
          </p>
          <p className="text-slate-600 text-xs mt-1">— Henry Ward Beecher</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-slate-900 dark:text-white font-semibold">
              Libro
            </span>
          </div>
          <div className="hidden lg:block" />

          <button
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h2 className="font-['Playfair_Display'] text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {serverError && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {serverError}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 outline-none transition-all
                      ${
                        errors.email
                          ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                          : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
                        message:
                          "Must be at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols",
                      },
                    })}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 outline-none transition-all
                      ${
                        errors.password
                          ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                          : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {serverError === "Invalid credential" && (
                <div className="flex justify-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
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
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              New student?{" "}
              <Link
                to="/register"
                className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
