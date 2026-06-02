import { RefreshCw } from "lucide-react";
import { useState } from "react";
function ResendButton({ canResend, secondsLeft, onResend, resendLoading }) {
  if (!canResend) {
    return (
      <p className="text-sm text-slate-400 dark:text-slate-500 text-center">
        OTP sent successfully Resend code in{" "}
        <span className="tabular-nums font-semibold text-slate-600 dark:text-slate-300">
          {secondsLeft}s
        </span>
      </p>
    );
  }
  return (
    <button
      onClick={onResend}
      disabled={resendLoading}
      className=" mx-auto flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors disabled:opacity-60"
    >
      <RefreshCw
        className={`w-3.5 h-3.5 ${resendLoading ? "animate-spin" : ""}`}
      />
      {resendLoading ? "Sending…" : "Resend OTP"}
    </button>
  );
}

export default ResendButton;
