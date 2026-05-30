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
import { verifyEmail } from "../../api/auth.api";
import OTPInput from "./OtpInputBoxPage";
import PendingApprovalScreen from "./OtpVerifyPendingApprovalScreen";

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

// ----------------------------------- MAIN PAGE -----------------------------------
export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState("");

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
  // console.log(location.state.email);

  const email = "demo@email.com"; // replace with location.state?.email
  const loading = false;
  const error = ""; // replace with your error state
  const canResend = false;
  const secs = 45;

  const handleVerify = async () => {
    try {
      const res = await OTPInput(value);
    } catch (error) {
      // Error -
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-[420px] space-y-7">
          <div className="flex lg:hidden justify-center ">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center">
              <Mail className="w-7 h-7 text-amber-500" />
            </div>
          </div>

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

          <OTPInput value={otp} onChange={setOtp} disabled={loading} />

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

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-black">!</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

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

          <ResendButton
            canResend={canResend}
            secondsLeft={secs}
            onResend={() => {}} // wire up your resend handler
            loading={false}
          />
          <PendingApprovalScreen />

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
