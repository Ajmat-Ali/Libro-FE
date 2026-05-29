// ─────────────────────────────────────────────────────────────────
// DESIGN ONLY — no API calls, no form submission logic
// next I'll handle:
//   - calling POST /api/auth/verify-email  { email, otp }
//   - calling POST /api/auth/resend-otp    { email }
//   - showing "verified" state after success
//   - showing error message on wrong OTP
// -----------------------------------

import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, RefreshCw, ArrowLeft, CheckCircle2, Clock } from "lucide-react";

// ----------------------------------- 6-BOX OTP INPUT -----------------------------------
// Pure UI component — exposes `value` (6-char string) via onChange
function OTPInput({ value = "", onChange, disabled = false }) {
  const refs = useRef([]);

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1); // only last digit
    const arr = value.split("");
    arr[index] = digit;
    onChange(arr.join("").slice(0, 6));
    // Auto-advance to next box
    if (digit && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = value.split("");
      if (arr[index]) {
        arr[index] = "";
        onChange(arr.join(""));
      } else if (index > 0) {
        arr[index - 1] = "";
        onChange(arr.join(""));
        refs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(digits.padEnd(6, "").slice(0, 6));
    // Focus the last filled position
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const filled = !!value[i];
        return (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            className={`
              w-11 h-14 sm:w-12 sm:h-[58px]
              text-center text-2xl font-black
              rounded-2xl border-2 outline-none
              transition-all duration-150
              bg-slate-50 dark:bg-slate-900
              text-slate-900 dark:text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                filled
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md shadow-amber-100 dark:shadow-none scale-105"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-amber-400 focus:bg-white dark:focus:bg-slate-800 focus:shadow-md focus:shadow-amber-100/50 dark:focus:shadow-none"
              }
            `}
          />
        );
      })}
    </div>
  );
}

// ----------------------------------- RESEND BUTTON (design only — wire up onClick yourself) -----------------------------------
function ResendButton({ canResend, secondsLeft, onResend, loading }) {
  if (!canResend) {
    return (
      <p className="text-sm text-slate-400 dark:text-slate-500 text-center">
        Resend code in{" "}
        <span className="tabular-nums font-semibold text-slate-600 dark:text-slate-300">
          {secondsLeft}s
        </span>
      </p>
    );
  }
  return (
    <button
      onClick={onResend}
      disabled={loading}
      className="mx-auto flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors disabled:opacity-60"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Sending…" : "Resend OTP"}
    </button>
  );
}

// ----------------------------------- PENDING APPROVAL SCREEN -----------------------------------
export function PendingApprovalScreen() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center space-y-6">
        {/* Icon stack */}
        <div className="relative flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="absolute bottom-0 right-[calc(50%-40px-8px)] translate-x-[56px] w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display']">
            Email Verified!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
            Your account is under review by the library owner
          </p>
        </div>

        {/* Steps */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-5 text-left space-y-3.5">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            What happens next
          </p>
          {[
            "Library owner reviews your registration",
            "You'll receive login access once approved",
            "This usually takes a few hours",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-300">
                  {i + 1}
                </span>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                {step}
              </p>
            </div>
          ))}
        </div>

        <Link
          to="/login"
          className="block w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-amber-200 dark:shadow-none"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

// ----------------------------------- MAIN PAGE -----------------------------------
export default function VerifyOTPPage() {
  //  UI state only (wire up logic yourself)
  const [otp, setOtp] = useState("");

  // TASK FOR YOU:
  //   const location     = useLocation()
  //   const email        = location.state?.email ?? ""
  //   const navigate     = useNavigate()
  //   const [loading, setLoading]     = useState(false)
  //   const [error,   setError]       = useState("")
  //   const [verified,setVerified]    = useState(false)
  //   const [canResend, setCanResend] = useState(false)
  //   const [secs, setSecs]           = useState(60)
  //   -> show <PendingApprovalScreen /> when verified === true

  const location = useLocation();
  console.log(location.state.email);

  const email = "demo@email.com"; // replace with location.state?.email
  const loading = false;
  const error = ""; // replace with your error state
  const canResend = false;
  const secs = 45;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-[420px] space-y-7">
          {/* Mobile: mail icon */}
          <div className="flex lg:hidden justify-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center">
              <Mail className="w-7 h-7 text-amber-500" />
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display']">
              Verify your email
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200 break-all">
                {email}
              </span>
            </p>
          </div>

          {/* ── OTP Boxes ── */}
          <OTPInput value={otp} onChange={setOtp} disabled={loading} />

          {/* Progress dots below boxes */}
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i < otp.length
                    ? "bg-amber-500 scale-110"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Error message (hidden by default) */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-black">!</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Verify button */}
          <button
            disabled={otp.length < 6 || loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-amber-200 dark:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Verifying…
              </>
            ) : otp.length < 6 ? (
              `Enter ${6 - otp.length} more digit${6 - otp.length !== 1 ? "s" : ""}`
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend */}
          <ResendButton
            canResend={canResend}
            secondsLeft={secs}
            onResend={() => {}} // wire up your resend handler
            loading={false}
          />

          {/* Back link */}
          <div className="flex justify-center">
            <Link
              to="/register"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
