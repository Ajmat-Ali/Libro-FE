import { CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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

export default PendingApprovalScreen;
