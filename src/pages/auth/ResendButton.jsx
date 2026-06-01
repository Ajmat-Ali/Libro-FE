import { RefreshCw } from "lucide-react";
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

export default ResendButton;
