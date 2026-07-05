import { Clock } from "lucide-react";
import SlotCard from "./SlotCard";

function SkeletonSlotCard() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-700 rounded" />
        <div className="h-3 w-48 bg-slate-100 dark:bg-slate-700 rounded" />
        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-700 rounded" />
      </div>
      <div className="h-6 w-16 bg-slate-100 dark:bg-slate-700 rounded-full" />
      <div className="flex gap-1.5">
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg" />
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg" />
      </div>
    </div>
  );
}

export default function SlotsTab({ slots, loading, onEdit, onDelete, error }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonSlotCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">No Slot Found</p>
        <p className="text-sm text-red-500 mt-1">
          {error && "There are currently no available slots."}
        </p>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          No time slots yet
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Add your first slot using the + button. Plans will be auto-generated
          once a slot is created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <SlotCard
          key={slot._id}
          slot={slot}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
