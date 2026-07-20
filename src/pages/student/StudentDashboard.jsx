import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CalendarCheck,
  CheckCircle2,
  LayoutGrid,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import { getStudentDashboard } from "../../api/student.api";
import BookingCard from "./components/BookingCard";
import DashboardSkeleton from "./components/DashboardSkeleton";
import { getGreeting } from "../../utils/dateUtils";

const StudentDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getStudentDashboard()
      .then((res) => mounted && setData(res.data))
      .catch(
        () =>
          mounted &&
          setError("Could not load your dashboard. Please try again."),
      )
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">
        {error}
      </div>
    );
  }

  const hasBookings = data?.bookings?.length > 0;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-white/10" />
        <p className="text-amber-100 text-sm font-medium relative">
          {getGreeting()}
        </p>
        <h1 className="font-serif text-2xl font-bold mt-0.5 relative">
          {user?.firstName || "Welcome"}
        </h1>
        {data.library?.name && (
          <p className="text-amber-50/90 text-sm mt-2 relative">
            {data?.library?.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
            <CalendarCheck size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white leading-none">
              {data?.summary?.totalActiveBookings}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active Bookings
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white leading-none">
              {data?.summary?.attendedToday}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Checked In Today
            </p>
          </div>
        </div>
      </div>

      <Link
        to="/student/browse"
        className="flex items-center justify-between rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-500/5 p-4 group transition hover:bg-amber-50 dark:hover:bg-amber-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <LayoutGrid size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Book a new seat
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse floors, slots and live availability
            </p>
          </div>
        </div>
        <ArrowRight
          size={18}
          className="text-amber-500 group-hover:translate-x-0.5 transition"
        />
      </Link>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Your Bookings
          </h2>
          {hasBookings && (
            <Link
              to="/student/bookings"
              className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1"
            >
              View all
              <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {hasBookings ? (
          <div className="space-y-3">
            {data.bookings.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <BookOpen
              className="mx-auto text-slate-300 dark:text-slate-600"
              size={32}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              You don't have any active bookings yet.
            </p>
            <Link
              to="/student/browse"
              className="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Browse Seats
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
