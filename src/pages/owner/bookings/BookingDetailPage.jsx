// BookingDetailPage.jsx
// Place at: src/pages/owner/BookingDetailPage.jsx
//
// Add to AppRouter.jsx:
//   <Route path="/owner/bookings/:bookingId" element={<ProtectedRoute role="owner"><OwnerLayout><BookingDetailPage /></OwnerLayout></ProtectedRoute>} />
//
// Add to owner.api.js:
//   export const getOneBooking = (id) => axiosInstance.get(`/owner/bookings/${id}`);
//
// In BookingsPage.jsx — make each row clickable (add a View button or wrap with navigate):
//   import { useNavigate } from "react-router-dom";
//   const navigate = useNavigate();
//   // Inside row actions:
//   <button onClick={() => navigate(`/owner/bookings/${b._id}`)} ...>View</button>

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getOneBooking } from "../../../api/owner.api";
import BookingDetailCard from "./BookingDetailCard";
import StudentBookingHistory from "./StudentBookingHistory";
import CancelModal from "./CancelModal";
import ExtendModal from "./ExtendModal";
import CreateBookingDrawer from "./CreateBookingDrawer";
import { cancelBooking, extendBooking } from "../../../api/owner.api";

// ── SKELETON ─────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-4">
        <div className="h-1.5 rounded bg-slate-200 dark:bg-slate-700 w-full" />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-24 bg-slate-100 dark:bg-slate-700 rounded" />
          </div>
        </div>
        <div className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
      </div>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 space-y-4"
          >
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-700 rounded" />
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 w-16 bg-slate-100 dark:bg-slate-700 rounded" />
                  <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────
export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelModal, setCancelModal] = useState(false);
  const [extendModal, setExtendModal] = useState(false);
  const [rebookOpen, setRebookOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Fetch booking
  const fetchBooking = () => {
    setLoading(true);
    setError("");
    getOneBooking(bookingId)
      .then((res) => {
        setBooking(res.data.booking);
        setPayment(res.data.payment ?? null);
      })
      .catch(() =>
        setError("Booking not found or you don't have access to it."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  // ── Action handlers ──
  const handleCancel = async (reason) => {
    setActionLoading(true);
    try {
      await cancelBooking(bookingId, { cancelReason: reason });
      setCancelModal(false);
      setToast({ type: "success", msg: "Booking cancelled successfully" });
      fetchBooking();
    } catch (err) {
      setToast({
        type: "error",
        msg: err.response?.data?.message ?? "Failed to cancel",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtend = async (startDate) => {
    setActionLoading(true);
    try {
      const res = await extendBooking(bookingId, { startDate });
      const newId = res.data.booking?._id;
      setExtendModal(false);
      setToast({
        type: "success",
        msg: "Booking renewed! Redirecting to new booking…",
      });
      setTimeout(() => {
        if (newId) navigate(`/owner/bookings/${newId}`);
        else fetchBooking();
      }, 1500);
    } catch (err) {
      setToast({
        type: "error",
        msg: err.response?.data?.message ?? "Failed to renew",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Derived
  const studentId = booking?.studentId?._id ?? booking?.studentId;

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div className="p-5 sm:p-6 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        <Link
          to="/owner/bookings"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Bookings
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px]">
          {loading ? "Loading…" : `Booking Detail`}
        </span>
      </div>

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Booking Detail
        </h1>
        {!loading && booking && (
          <p className="text-xs text-slate-400 mt-1 font-mono">
            ID: {booking._id}
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/40 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Booking not found
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">
              {error}
            </p>
            <button
              onClick={() => navigate("/owner/bookings")}
              className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <DetailSkeleton />}

      {/* Content */}
      {!loading && !error && booking && (
        <div className="space-y-6">
          {/* Detail card */}
          <BookingDetailCard
            booking={booking}
            payment={payment}
            onCancel={() => setCancelModal(true)}
            onExtend={() => setExtendModal(true)}
            onRebook={() => setRebookOpen(true)}
          />

          {/* Student history */}
          {studentId && (
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3 font-['Playfair_Display']">
                Student Booking History
              </h2>
              <StudentBookingHistory
                studentId={studentId}
                currentBookingId={bookingId}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {cancelModal && (
        <CancelModal
          booking={booking}
          onClose={() => setCancelModal(false)}
          onConfirm={handleCancel}
          loading={actionLoading}
        />
      )}
      {extendModal && booking && (
        <ExtendModal
          booking={booking}
          onClose={() => setExtendModal(false)}
          onConfirm={handleExtend}
          loading={actionLoading}
        />
      )}

      {/* Re-book drawer (opens Create with student pre-selected) */}
      {rebookOpen && (
        <CreateBookingDrawer
          onClose={() => setRebookOpen(false)}
          onSuccess={() => {
            setRebookOpen(false);
            setToast({ type: "success", msg: "New booking created!" });
          }}
        />
      )}
    </div>
  );
}
