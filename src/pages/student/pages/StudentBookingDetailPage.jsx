import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getOneBooking,
  getStudentProfile,
  fetchMyQRAsBase64,
} from "../../../api/student.api";
import BookingStatusBanner from "../components/BookingStatusBanner";
import BookingInfoCard from "../components/BookingInfoCard";
import PaymentSection from "../components/PaymentSection";
import BookingDetailSkeleton from "../components/BookingDetailSkeleton";
import MemberIdCard from "../../../components/MemberIdCard";
import { useSelector } from "react-redux";
import { LIBRARY_NAME } from "../../../constant/index";

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const [state, setState] = useState({
    booking: null,
    payment: null,
    qr: null,
  });
  const [profile, setProfile] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [bookingRes, profileRes] = await Promise.all([
          getOneBooking(bookingId),
          getStudentProfile(),
        ]);
        if (!mounted) return;
        setState(bookingRes);
        setProfile(profileRes.profile);
      } catch (err) {
        if (mounted) setError("Could not load this booking. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [bookingId]);

  useEffect(() => {
    let mounted = true;

    if (!state.qr?._id) {
      setQrLoading(false);
      return;
    }
    fetchMyQRAsBase64(state.qr._id).then((dataUrl) => {
      if (mounted) {
        setQrDataUrl(dataUrl);
        setQrLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [state.qr?._id]);

  if (loading) return <BookingDetailSkeleton />;

  if (error || !state.booking) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {error || "Booking not found."}
        </p>
        <Link
          to="/student/dashboard"
          className="inline-block mt-4 text-amber-600 dark:text-amber-400 text-sm font-medium"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { booking, payment } = state;

  return (
    <div className="space-y-4">
      <Link
        to="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </Link>

      <BookingStatusBanner status={booking.status} />

      <BookingInfoCard booking={booking} />

      <PaymentSection payment={payment} />

      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Your Membership Pass
        </h3>
        {qrLoading ? (
          <div className="w-[400px] h-[248px] max-w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse mx-auto" />
        ) : (
          <MemberIdCard
            booking={booking}
            membershipId={profile?.membershipId}
            studentPhoto={profile?.photo}
            qrDataUrl={qrDataUrl}
            libraryName={LIBRARY_NAME}
            studentInfo={profile}
          />
        )}
      </div>
    </div>
  );
};

export default BookingDetailPage;
