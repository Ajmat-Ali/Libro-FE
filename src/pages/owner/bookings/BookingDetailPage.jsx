import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getMembers, getOneBooking } from "../../../api/owner.api";
import BookingDetailCard from "./BookingDetailCard";
import StudentBookingHistory from "./StudentBookingHistory";
import CancelModal from "./CancelModal";
import ExtendModal from "./ExtendModal";
import CreateBookingDrawer from "./CreateBookingDrawer";
import { cancelBooking, extendBooking } from "../../../api/owner.api";

import { fetchQRAsBase64 } from "../../../utils/qrUtils";
import MemberIdCard from "../../../components/MemberIdCard";
import DetailSkeleton from "./DetailSkeleton";
import { useSelector } from "react-redux";

// --------------------------------------- MAIN PAGE ---------------------------------------
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

  const [memberId, setMemberId] = useState(null);
  const [membershipId, setMembershipId] = useState(null);
  const [studentPhoto, setStudentPhoto] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);

  const library = useSelector((store) => store.library);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchBooking = () => {
    setLoading(true);
    setError("");
    getOneBooking(bookingId)
      .then((res) => {
        console.log(res?.data?.booking);
        setBooking(res?.data?.booking || {});
        setPayment(res?.data?.payment ?? null);
        fetchCardData(res.data.booking.studentId._id, res.data.booking._id);
      })
      .catch(() =>
        setError("Booking not found or you don't have access to it."),
      )
      .finally(() => setLoading(false));
  };

  const fetchCardData = async (userId, bookingId) => {
    setCardLoading(true);
    try {
      const profileRes = await getMembers({ userId, limit: 1 });

      const profile = profileRes?.members[0];
      if (!profile) return;

      setMemberId(profile._id);
      setStudentPhoto(profile.photo ?? null);
      setMembershipId(profile.membershipId ?? null);

      const qr = await fetchQRAsBase64(profile?.userId?._id, bookingId);

      setQrDataUrl(qr);
    } catch (err) {
      console.error("Card data fetch failed:", err);
    } finally {
      setCardLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  // --------------------------------------- Action handlers ---------------------------------------
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

  // --------------------------------------- RENDER ---------------------------------------
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

      {cardLoading ? (
        <div className="w-[400px] h-[248px] rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse m-auto mb-10" />
      ) : (
        <MemberIdCard
          booking={booking}
          membershipId={membershipId}
          studentPhoto={studentPhoto}
          qrDataUrl={qrDataUrl}
          libraryName={library.name}
        />
      )}

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

      {loading && <DetailSkeleton />}

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
