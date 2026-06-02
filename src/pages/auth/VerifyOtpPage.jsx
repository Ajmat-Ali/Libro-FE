import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, RefreshCw, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { verifyEmail } from "../../api/auth.api";
import OTPInput from "./OtpInputBoxPage";
import PendingApprovalScreen from "./OtpVerifyPendingApprovalScreen";
import ResendButton from "./ResendButton";
import { resendOTP } from "../../api/auth.api";

// ----------------------------------- MAIN PAGE -----------------------------------
export default function VerifyOTPPage() {
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [secs, setSecs] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState(
    () => JSON.parse(localStorage.getItem("email")) || location?.state?.email,
  );
  const [resendStyle, setdResendStyle] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((pre) => {
        if (pre <= 0) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return pre - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [canResend]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await verifyEmail({
        email,
        otp,
      });
      setVerified(true);
      setLoading(false);
      setError("");
      localStorage.removeItem("email");
    } catch (error) {
      setLoading(false);
      console.log(normalizeServerError(error));
      setError(normalizeServerError(error));
      // Error -
    }
  };

  const normalizeServerError = (error) => {
    const response = error?.response?.data;
    if (response?.errors) {
      return Object.values(response?.errors)[0];
    }
    if (response?.message) {
      return response?.message;
    }

    return "Something went wrong";
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const res = await resendOTP({ email });

      setCanResend(false);
      setSecs(60);
      setdResendStyle(true);
      setResendLoading(false);
      setError("");
    } catch (error) {
      console.log(error);
      setResendLoading(false);
      setError(normalizeServerError(error));
    }
  };

  if (verified) return <PendingApprovalScreen />;

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
            {email && (
              <p
                className={` dark:text-slate-400 text-sm mt-1.5 leading-relaxed ${resendStyle ? "text-green-500" : "text-slate-500"}`}
              >
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200 break-all">
                  {email ? email : "No email found please resend Otp"}
                </span>
              </p>
            )}
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
            onClick={handleVerify}
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
            onResend={handleResendOtp}
            resendLoading={resendLoading}
          />

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
