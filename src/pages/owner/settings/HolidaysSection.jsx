// src/pages/owner/settings/HolidaysSection.jsx

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  CalendarOff,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { addHoliday, removeHoliday } from "../../../api/owner.api";

// ── helpers ──────────────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const inputCls =
  "w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 " +
  "dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white " +
  "placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 " +
  "focus:border-amber-400 transition-colors";

// ── MAIN ──────────────────────────────────────────────────────────
export default function HolidaysSection() {
  const library = useSelector(
    (s) => s.library?.data ?? s.auth?.library ?? null,
  );

  // seed from Redux; kept in local state so UI updates instantly
  const [holidays, setHolidays] = useState(library?.holidays ?? []);

  // add form state
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);

  // per-item delete loading: { [holidayId]: true }
  const [deleting, setDeleting] = useState({});

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // ── ADD ─────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!date) {
      showToast("error", "Please pick a date");
      return;
    }
    if (!reason.trim()) {
      showToast("error", "Reason is required");
      return;
    }

    setAdding(true);
    try {
      const res = await addHoliday({ date, reason: reason.trim() });
      // backend returns updated library — grab new holidays array
      const updated = res.data?.library?.holidays ?? res.data?.holidays;
      if (updated) {
        setHolidays(updated);
      } else {
        // optimistic fallback
        setHolidays((prev) => [...prev, { _id: Date.now(), date, reason }]);
      }
      setDate("");
      setReason("");
      showToast("success", "Holiday added");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message ?? "Failed to add holiday",
      );
    } finally {
      setAdding(false);
    }
  };

  // ── DELETE ───────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting((p) => ({ ...p, [id]: true }));
    try {
      await removeHoliday(id);
      setHolidays((prev) => prev.filter((h) => h._id !== id));
      showToast("success", "Holiday removed");
    } catch (err) {
      showToast("error", err.response?.data?.message ?? "Failed to remove");
    } finally {
      setDeleting((p) => ({ ...p, [id]: false }));
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Holidays
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Mark dates when the library will be closed
        </p>
      </div>

      {/* ── Holiday list ─────────────────────────────────────── */}
      <div className="space-y-2">
        {holidays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarOff className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
              No holidays added yet
            </p>
            <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
              Add a holiday using the form below
            </p>
          </div>
        ) : (
          holidays.map((h) => (
            <div
              key={h._id}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl group hover:border-amber-200 dark:hover:border-amber-800/40 transition-colors"
            >
              {/* Date chip + reason */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl shrink-0">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-tight">
                    {new Date(h.date)
                      .toLocaleDateString("en-IN", { month: "short" })
                      .toUpperCase()}
                  </span>
                  <span className="text-base font-black text-amber-700 dark:text-amber-400 leading-tight">
                    {new Date(h.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                    {h.reason}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {fmtDate(h.date)} ·{" "}
                    {new Date(h.date) < new Date() ? (
                      <span className="text-slate-400">Past</span>
                    ) : (
                      <span className="text-emerald-500">Upcoming</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(h._id)}
                disabled={deleting[h._id]}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-40 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove holiday"
              >
                {deleting[h._id] ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Add holiday form ─────────────────────────────────── */}
      <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-500" />
          Add Holiday
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Reason <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Diwali, Republic Day…"
              className={inputCls}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          {toast && (
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                toast.type === "success"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500"
              }`}
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
            onClick={handleAdd}
            disabled={adding}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            {adding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Holiday
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
