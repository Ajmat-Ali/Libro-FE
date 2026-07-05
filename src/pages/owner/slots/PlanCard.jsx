import { useState } from "react";
import { togglePlanStatus } from "../../../api/owner.api";

const SEAT_TYPE_STYLES = {
  general: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  vip: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400",
  window:
    "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  cabin: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export default function PlanCard({ plan, onToggled }) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await togglePlanStatus(plan._id);
      onToggled(plan._id);
    } catch (err) {
      console.error("Toggle plan failed:", err);
    } finally {
      setToggling(false);
    }
  };

  const typeStyle =
    SEAT_TYPE_STYLES[plan.seatType] ||
    "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

  return (
    <div
      className={`bg-white dark:bg-slate-800 border rounded-2xl p-4 flex flex-col gap-3 transition-all ${
        plan.isActive
          ? "border-slate-100 dark:border-slate-700"
          : "border-slate-100 dark:border-slate-700 opacity-50"
      }`}
    >
      <span
        className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${typeStyle}`}
      >
        {plan.seatType}
      </span>

      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          ₹{plan.calculatedPrice}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          per month
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {plan.isActive ? "Active" : "Inactive"}
        </span>

        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`relative w-9 h-5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-400/40 ${
            plan.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
              plan.isActive ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
