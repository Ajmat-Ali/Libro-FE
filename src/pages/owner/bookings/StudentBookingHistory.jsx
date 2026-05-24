// StudentBookingHistory.jsx
// Place at: src/pages/owner/bookings/StudentBookingHistory.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Clock, Calendar } from "lucide-react";
import { getBookings } from "../../../api/owner.api";

// ── STATUS CONFIG ────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    label: "Active",
  },
  pending: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    label: "Pending",
  },
  expired: {
    bg: "bg-slate-100 dark:bg-slate-700/50",
    text: "text-slate-500 dark:text-slate-400",
    dot: "bg-slate-400",
    label: "Expired",
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "Cancelled",
  },
  rejected: {
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    label: "Rejected",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.expired;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Skeleton row
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-slate-100 dark:bg-slate-700 rounded w-2/5" />
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-3/5" />
      </div>
      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full" />
    </div>
  );
}

export default function StudentBookingHistory({ studentId, currentBookingId }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    // getBookings supports ?studentId= filter
    getBookings({ studentId, limit: 50 })
      .then((res) => setBookings(res.data.bookings ?? []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [studentId]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            All Bookings for this Student
          </h3>
          {!loading && (
            <p className="text-xs text-slate-400 mt-0.5">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
            </p>
          )}
        </div>
        <BookOpen className="w-4 h-4 text-slate-300 dark:text-slate-600" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-50 dark:divide-slate-700/40">
        {loading ? (
          [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-400">No booking history found</p>
          </div>
        ) : (
          bookings.map((b) => {
            const seat = b.seatId ?? {};
            const slot = b.timeSlotId ?? {};
            const isCurrent = b._id === currentBookingId;

            return (
              <button
                key={b._id}
                onClick={() => navigate(`/owner/bookings/${b._id}`)}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all group ${
                  isCurrent
                    ? "bg-amber-50/60 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    : "hover:bg-slate-50/60 dark:hover:bg-slate-700/20"
                }`}
              >
                {/* Left indicator */}
                <div
                  className={`w-1.5 h-10 rounded-full shrink-0 ${
                    isCurrent
                      ? "bg-amber-400"
                      : b.status === "active"
                        ? "bg-emerald-400"
                        : b.status === "pending"
                          ? "bg-amber-300"
                          : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Seat {seat.seatLabel ?? "—"}
                    </span>
                    {seat.seatType && (
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded capitalize">
                        {seat.seatType}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                        Viewing now
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {slot.name && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {slot.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {fmtDate(b.startDate)} → {fmtDate(b.endDate)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      ₹{b.price}
                    </span>
                  </div>
                </div>

                {/* Status + arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={b.status} />
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-400 transition-colors" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
