import { useState } from "react";
import {
  X,
  User,
  Calendar,
  CreditCard,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { updateSeatStatus, deleteSeat } from "../../../api/owner.api";

// ─── Seat type label map ──────────────────────────────────────────
const seatTypeLabel = {
  general: "General",
  vip: "VIP",
  window: "Window",
  cabin: "Cabin",
};

// ─── gridStatus display config ───────────────────────────────────
const gridStatusConfig = {
  available: {
    label: "Available",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  booked: {
    label: "Booked",
    badge: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
  expiring_soon: {
    label: "Expiring Soon",
    badge: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
  maintenance: {
    label: "Maintenance",
    badge: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  },
  reserved: {
    label: "Reserved",
    badge: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  },
  disabled: {
    label: "Disabled",
    badge: "bg-slate-500/15 text-slate-500 dark:text-slate-400",
  },
};

// ─── Info row — reused from MemberDetailPage pattern ─────────────
const InfoRow = ({ icon: Icon, label, value, valueClass = "" }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
        <p
          className={`text-sm font-medium text-slate-900 dark:text-white mt-0.5 ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

// ─── Spinner ─────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// ─── SeatDrawer ───────────────────────────────────────────────────
// item = { seat, gridStatus, dayLeft, bookingDetails }
const SeatDrawer = ({ seat: item, floorId, onClose, onSuccess }) => {
  const { seat, gridStatus, dayLeft, bookingDetails } = item;

  const [newStatus, setNewStatus] = useState(seat.status);
  const [statusReason, setStatusReason] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusDisplay =
    gridStatusConfig[gridStatus] || gridStatusConfig.disabled;

  // ── Format date nicely ────────────────────────────────────────
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ── Change seat status ────────────────────────────────────────
  const handleStatusChange = async () => {
    if (newStatus === seat.status) return;
    try {
      setStatusLoading(true);
      setError("");
      await updateSeatStatus(floorId, seat._id, {
        status: newStatus,
        statusReason: statusReason.trim() || undefined,
      });
      setSuccess("Seat status updated");
      onSuccess(); // re-fetch grid in parent
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  // ── Delete seat ───────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      setError("");
      await deleteSeat(floorId, seat._id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete seat");
      setDeleteLoading(false);
    }
  };

  // ── Days left color ───────────────────────────────────────────
  const daysLeftColor =
    dayLeft !== null && dayLeft <= 3
      ? "text-red-600 dark:text-red-400"
      : "text-orange-600 dark:text-orange-400";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      <div className=" fixed right-0 top-0 h-full w-full sm:w-[440px] bg-slate-50 dark:bg-slate-900 z-50 flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-700 animate-[slideInRight_0.3s_ease-out]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
                Seat {seat.seatLabel}
              </h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusDisplay.badge}`}
              >
                {statusDisplay.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {seatTypeLabel[seat.seatType]} · Physical status: {seat.status}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Content ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Error / Success banners */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
              {success}
            </div>
          )}

          {/* ── Section 1: Booking Details (only if booked/expiring) ── */}
          {bookingDetails && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Current Booking
              </h3>

              {/* Days left — prominent for expiring_soon */}
              {gridStatus === "expiring_soon" && dayLeft !== null && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <p className={`text-sm font-semibold ${daysLeftColor}`}>
                    Expires in {dayLeft} day{dayLeft !== 1 ? "s" : ""}
                  </p>
                </div>
              )}

              <InfoRow
                icon={User}
                label="Student"
                value={
                  bookingDetails.studentId
                    ? `${bookingDetails.studentId.firstName} ${bookingDetails.studentId.lastName || ""}`.trim()
                    : "—"
                }
              />
              <InfoRow
                icon={Calendar}
                label="Period"
                value={`${formatDate(bookingDetails.startDate)} → ${formatDate(bookingDetails.endDate)}`}
              />
              {gridStatus !== "expiring_soon" && dayLeft !== null && (
                <InfoRow
                  icon={Clock}
                  label="Days Remaining"
                  value={`${dayLeft} days`}
                />
              )}
              <InfoRow
                icon={CreditCard}
                label="Payment"
                value={
                  bookingDetails.paymentStatus === "paid" ? "Paid ✓" : "Pending"
                }
                valueClass={
                  bookingDetails.paymentStatus === "paid"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }
              />
            </div>
          )}

          {/* ── Section 2: Change Seat Status ─────────────────── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Change Physical Status
            </h3>

            {/* Status dropdown */}
            <div className="relative">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm appearance-none
                           text-slate-900 dark:text-white
                           bg-white dark:bg-slate-800
                           border-slate-200 dark:border-slate-700
                           focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                           outline-none transition-all"
              >
                <option value="active">Active — open for bookings</option>
                <option value="maintenance">
                  Maintenance — temporarily unavailable
                </option>
                <option value="reserved">Reserved — held by owner</option>
                <option value="disabled">Disabled — permanently removed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Optional reason */}
            {newStatus !== seat.status && (
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                  Reason{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chair broken, held for VIP member..."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  maxLength={200}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm
                             text-slate-900 dark:text-white placeholder-slate-400
                             bg-white dark:bg-slate-800/80
                             border-slate-200 dark:border-slate-700
                             focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                             outline-none transition-all"
                />
              </div>
            )}

            {/* Save status button — only shown if status changed */}
            {newStatus !== seat.status && (
              <button
                onClick={handleStatusChange}
                disabled={statusLoading}
                className="mt-3 w-full py-2.5 bg-amber-500 hover:bg-amber-600
                           disabled:bg-amber-500/60 disabled:cursor-not-allowed
                           text-slate-900 font-semibold rounded-xl transition-all
                           text-sm flex items-center justify-center gap-2"
              >
                {statusLoading ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  "Save Status"
                )}
              </button>
            )}
          </div>

          {/* ── Section 3: Danger Zone — Delete ───────────────── */}
          {/* Only show delete if seat is not currently booked */}
          {gridStatus !== "booked" && gridStatus !== "expiring_soon" && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-red-100 dark:border-red-500/20">
              <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                Deleting a seat is permanent and cannot be undone.
              </p>

              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="w-full py-2.5 text-sm font-semibold rounded-xl transition-all
                             bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400
                             hover:bg-red-100 dark:hover:bg-red-500/20
                             border border-red-200 dark:border-red-500/30"
                >
                  Delete Seat
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium text-center">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700
                                 text-slate-700 dark:text-slate-300 text-sm font-medium
                                 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700
                                 disabled:opacity-60 disabled:cursor-not-allowed
                                 text-white text-sm font-semibold rounded-xl
                                 transition-all flex items-center justify-center gap-2"
                    >
                      {deleteLoading ? (
                        <>
                          <Spinner /> Deleting...
                        </>
                      ) : (
                        "Yes, Delete"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 dark:border-slate-700
                       text-slate-700 dark:text-slate-300 font-medium rounded-xl
                       hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SeatDrawer;
