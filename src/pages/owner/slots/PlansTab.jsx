import { Receipt } from "lucide-react";
import PlanCard from "./PlanCard";

function SkeletonPlanCard() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 animate-pulse space-y-3">
      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full" />
      <div className="h-7 w-20 bg-slate-100 dark:bg-slate-700 rounded" />
      <div className="h-3 w-14 bg-slate-100 dark:bg-slate-700 rounded" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-10 bg-slate-100 dark:bg-slate-700 rounded" />
        <div className="h-5 w-9 bg-slate-100 dark:bg-slate-700 rounded-full" />
      </div>
    </div>
  );
}

export default function PlansTab({ plans, loading, onToggled, error }) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((g) => (
          <div key={g}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-4 w-24 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonPlanCard key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Receipt className="w-7 h-7 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          No plans yet
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Plans are auto-generated when you create a slot. Go to the Slots tab
          to add one.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">No Plan Found</p>
        <p className="text-sm text-red-500 mt-1">
          {error && "There are currently no available Plans."}
        </p>
      </div>
    );
  }

  const grouped = plans.reduce((acc, plan) => {
    const slotId = plan.timeSlotId._id;
    if (!acc[slotId]) {
      acc[slotId] = { slot: plan.timeSlotId, items: [] };
    }
    acc[slotId].items.push(plan);
    return acc;
  }, {});

  const TYPE_ORDER = ["general", "vip", "window", "cabin"];
  Object.values(grouped).forEach((g) => {
    g.items.sort(
      (a, b) => TYPE_ORDER.indexOf(a.seatType) - TYPE_ORDER.indexOf(b.seatType),
    );
  });

  return (
    <div className="space-y-6">
      {Object.values(grouped).map(({ slot, items }) => (
        <div key={slot._id}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
              {slot.name}
            </span>
            {slot.startTimeDisplay && (
              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                {slot.startTimeDisplay} - {slot.endTimeDisplay}
              </span>
            )}
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((plan) => (
              <PlanCard key={plan._id} plan={plan} onToggled={onToggled} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
