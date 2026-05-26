import { useState } from "react";
import { useSelector } from "react-redux";
import useToast from "./useToast";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateLibrary } from "../../../api/owner.api";
import { useDispatch } from "react-redux";
import { setLibrary } from "../../../store/slices/library";

const SEAT_TYPES = [
  {
    key: "general",
    label: "General",
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-700",
  },
  {
    key: "vip",
    label: "VIP",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
  {
    key: "window",
    label: "Window",
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-900/30",
  },
  {
    key: "cabin",
    label: "Cabin",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
];

function HourlyRatesSection() {
  const dispatch = useDispatch();
  const library = useSelector((s) => s.library ?? null);

  const [rates, setRates] = useState({
    general: library?.hourlyRates?.general ?? 0,
    vip: library?.hourlyRates?.vip ?? 0,
    window: library?.hourlyRates?.window ?? 0,
    cabin: library?.hourlyRates?.cabin ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [toast, showToast] = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateLibrary({ hourlyRates: rates });
      showToast("success", "Rates updated — plans will auto-recalculate");
      dispatch(setLibrary(res?.data?.library ?? {}));
    } catch (err) {
      showToast("error", err.response?.data?.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Hourly Rates
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Price per hour per seat type
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
          i
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Plans are auto-calculated
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            Changing a rate will automatically recalculate the monthly price for
            all plans using that seat type. Existing bookings are not affected.
          </p>
        </div>
      </div>

      {/* Rate inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SEAT_TYPES.map(({ key, label, color, bg }) => (
          <div
            key={key}
            className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-700 ${bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-bold ${color}`}>{label}</span>
              <span className="text-xs text-slate-400">per hour</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                ₹
              </span>
              <input
                type="number"
                min={0}
                value={rates[key]}
                onChange={(e) =>
                  setRates((p) => ({ ...p, [key]: Number(e.target.value) }))
                }
                className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-colors"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        {toast && (
          <div
            className={`flex items-center gap-2 text-sm font-medium ${toast.type === "success" ? "text-emerald-600" : "text-red-500"}`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.msg}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : "Update Rates"}
        </button>
      </div>
    </div>
  );
}

export default HourlyRatesSection;
