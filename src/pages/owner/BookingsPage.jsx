import { useState, useEffect, useCallback, useRef } from "react";
import {
  BookOpen,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Ban,
  RefreshCw,
  AlertCircle,
  Calendar,
  Clock,
  X,
} from "lucide-react";
import {
  getBookings,
  cancelBooking,
  extendBooking,
  getSlots,
  getMembers,
} from "../../api/owner.api";
import CreateBookingDrawer from "./bookings/CreateBookingDrawer";
import SkeletonRow from "./bookings/SkeletonRow";
import ExtendModal from "./bookings/ExtendModal";
import fmtDate from "./bookings/fmtDate";
import { STATUS_CONFIG, TABS, daysLeft } from "./bookings/constant";
import CancelModal from "./bookings/CancelModal";
import { current } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

// ------------------------------- STATUS BADGE -----------------------------------
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.expired;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState("all");
  const [studentSearch, setStudentSearch] = useState("");
  const [slotFilter, setSlotFilter] = useState("");
  const [slots, setSlots] = useState([]);

  const [studentResults, setStudentResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [searchBooking, setSearchBooking] = useState([]);
  const [serverError, setServerError] = useState("");

  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [cancelModal, setCancelModal] = useState(null); // booking object
  const [extendModal, setExtendModal] = useState(null); // booking object
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Fetch bookings
  const fetchBookings = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit: 10 };
        if (activeTab !== "all") params.status = activeTab;

        if (slotFilter) params.slotId = slotFilter;

        const res = await getBookings(params);
        setBookings(res.data.bookings ?? []);

        setPagination({
          currentPage: res.data.page ?? 1,
          totalPages: res?.data?.totalPages ?? 1,
          total: res.data.total ?? 0,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [activeTab, slotFilter],
  );

  useEffect(() => {
    fetchBookings(1);
  }, [fetchBookings]);

  //////////////////////////////////////////

  // ------------------ Debouncing for search studentId ------------
  const handleStudentSearch = (val) => {
    setStudentSearch(val);
    setShowStudentDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setStudentResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setStudentLoading(true);
      try {
        setSearchBooking([]);

        const res = await getBookings({
          search: val.trim(),
          limit: 8,
        });

        setStudentResults(res?.data?.bookings ?? []);
      } catch (err) {
        console.log(err);
        setStudentResults([]);
        setServerError(err.message);
      } finally {
        setStudentLoading(false);
      }
    }, 400);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowStudentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load slot options for filter dropdown
  useEffect(() => {
    getSlots()
      .then((res) => setSlots(res.data.slots ?? []))
      .catch(() => {});
  }, []);

  // --------------------------------------- ACTION HANDLERS ---------------------------------------
  const handleCancel = async (reason) => {
    setActionLoading(true);
    try {
      await cancelBooking(cancelModal._id, { cancelReason: reason });
      setCancelModal(null);
      setToast({ type: "success", msg: "Booking cancelled successfully" });
      fetchBookings(pagination.currentPage);
    } catch (err) {
      setToast({
        type: "error",
        msg: err.response?.data?.message ?? "Failed to cancel booking",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtend = async (startDate) => {
    setActionLoading(true);
    try {
      await extendBooking(extendModal._id, { startDate });
      setExtendModal(null);
      setToast({ type: "success", msg: "Booking renewed successfully" });
      fetchBookings(pagination.currentPage);
    } catch (err) {
      setToast({
        type: "error",
        msg: err.response?.data?.message ?? "Failed to renew booking",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------------- RENDER ---------------------------------------
  return (
    <div className="p-5 sm:p-6 max-w-7xl mx-auto">
      {/* --------------------------------------- Toast --------------------------------------- */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* --------------------------------------- Page Header --------------------------------------- */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
            Bookings
          </h1>
          {/* <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Seat reservations across all members
            {!loading && (
              <span className="ml-1 text-amber-600 dark:text-amber-400 font-medium">
                · {pagination.total} total
              </span>
            )}
          </p> */}
        </div>
        <button
          onClick={() => setShowCreateDrawer(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-amber-200 dark:shadow-none"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* --------------------------------------- Filters Bar --------------------------------------- */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        {/* Status tabs pill */}
        <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-0.5 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === t.key
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative opacity-40- pointer-events-none-">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

          {/* {selectedStudent ? (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
              <div className="w-9 h-9 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-sm font-bold text-amber-800 dark:text-amber-200 shrink-0 overflow-hidden">
                {(selectedStudent.userId?.firstName?.[0] ?? "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {selectedStudent?.userId?.firstName}{" "}
                  {selectedStudent?.userId?.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {selectedStudent?.membershipId} <br />
                  {selectedStudent?.userId?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setStudentSearch("");
                }}
                className="p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-600 dark:text-amber-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : ( */}
          <div ref={dropdownRef} className="relative  ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Type name or email to search…"
              value={studentSearch}
              onChange={(e) => handleStudentSearch(e.target.value)}
              onFocus={() => studentSearch && setShowStudentDropdown(true)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              autoComplete="off"
            />

            {showStudentDropdown && studentSearch && (
              <div className="absolute z-10 mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                {studentLoading ? (
                  <div className="px-4 py-3.5 text-sm text-slate-400 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Searching…
                  </div>
                ) : studentResults.length === 0 ? (
                  <div className="px-4 py-3.5 text-sm text-slate-400">
                    No booking found for this member
                  </div>
                ) : (
                  studentResults.map((b) => (
                    <button
                      key={b._id}
                      onClick={() => {
                        setSelectedStudent(b);
                        setShowStudentDropdown(false);
                        setStudentSearch("");
                        navigate(`/owner/bookings/${b._id}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0">
                        {(b.studentId?.firstName?.[0] ?? "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {b.studentId?.firstName} {b.studentId?.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {b.studentId?.email}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {/* )} */}
        </div>

        {/* Slot filter */}
        {slots.length > 0 && (
          <select
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-sm"
          >
            <option value="">All Slots</option>
            {slots.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} : {s.startTimeDisplay} - {s.endTimeDisplay}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* --------------------------------------- Table Card --------------------------------------- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80">
                {["Member", "Seat", "Time Slot", "Period", "Status", ""].map(
                  (h, i) => (
                    <th
                      key={i}
                      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide ${i === 5 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center ">
                    <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      No bookings found
                    </p>
                    <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                      {activeTab !== "all"
                        ? "Try a different filter"
                        : "Create your first booking using the button above"}
                    </p>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const student = b.studentId ?? {};
                  const seat = b.seatId ?? {};
                  const slot = b.timeSlotId ?? {};
                  const days =
                    b.status === "active" ? daysLeft(b.endDate) : null;
                  const initials =
                    `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase() ||
                    "?";

                  return (
                    <tr
                      key={b._id}
                      className="border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      {/* Member */}
                      <td
                        onClick={() => navigate(`/owner/bookings/${b._id}`)}
                        className="px-4 py-3.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {student.membershipId ?? student.email ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Seat */}
                      <td
                        onClick={() => navigate(`/owner/bookings/${b._id}`)}
                        className="px-4 py-3.5"
                      >
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                          {seat.seatLabel ?? "—"}
                        </span>
                        {seat.seatType && (
                          <span className="ml-1.5 text-xs text-slate-400 capitalize bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
                            {seat.seatType}
                          </span>
                        )}
                      </td>

                      {/* Time Slot */}
                      <td
                        onClick={() => navigate(`/owner/bookings/${b._id}`)}
                        className="px-4 py-3.5 whitespace-nowrap"
                      >
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {slot.name ?? "—"}
                        </p>
                        {slot.startTimeDisplay && (
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {slot.startTimeDisplay} – {slot.endTimeDisplay}
                          </p>
                        )}
                      </td>

                      {/* Period */}
                      <td
                        onClick={() => navigate(`/owner/bookings/${b._id}`)}
                        className="px-4 py-3.5 whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>{fmtDate(b.startDate)}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 ml-4">
                          → {fmtDate(b.endDate)}
                        </p>
                        {days !== null && (
                          <p
                            className={`text-xs font-semibold mt-0.5 ml-4 ${
                              days <= 0
                                ? "text-red-500"
                                : days <= 3
                                  ? "text-red-500"
                                  : days <= 7
                                    ? "text-amber-500"
                                    : "text-emerald-500"
                            }`}
                          >
                            {days <= 0 ? "Expires today" : `${days}d remaining`}
                          </p>
                        )}
                      </td>

                      {/* Status + Price */}
                      <td
                        onClick={() => navigate(`/owner/bookings/${b._id}`)}
                        className="px-4 py-3.5"
                      >
                        <StatusBadge status={b.status} />
                        <p className="text-xs text-slate-400 mt-1">
                          ₹{b.price}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status === "active" && (
                            <>
                              <button
                                onClick={() => setExtendModal(b)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                              >
                                Renew
                              </button>
                              <button
                                onClick={() => setCancelModal(b)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {(b.status === "expired" ||
                            b.status === "cancelled") && (
                            <button
                              onClick={() => setShowCreateDrawer(true)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              Re-book
                            </button>
                          )}
                          {b.status === "rejected" && (
                            <span className="text-xs text-slate-300 dark:text-slate-600">
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-400">
              Page{" "}
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {pagination.currentPage}
              </span>{" "}
              of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => fetchBookings(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
              {/* Page number chips */}
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => fetchBookings(pg)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                      pg === pagination.currentPage
                        ? "bg-amber-500 text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}

              <button
                onClick={() => fetchBookings(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------- Modals --------------------------------------- */}
      {cancelModal && (
        <CancelModal
          booking={cancelModal}
          onClose={() => setCancelModal(null)}
          onConfirm={handleCancel}
          loading={actionLoading}
        />
      )}
      {extendModal && (
        <ExtendModal
          booking={extendModal}
          onClose={() => setExtendModal(null)}
          onConfirm={handleExtend}
          loading={actionLoading}
        />
      )}

      {/* --------------------------------------- Create Drawer --------------------------------------- */}
      {showCreateDrawer && (
        <CreateBookingDrawer
          onClose={() => setShowCreateDrawer(false)}
          onSuccess={() => {
            setShowCreateDrawer(false);
            setToast({ type: "success", msg: "Booking created successfully" });
            fetchBookings(1);
          }}
        />
      )}
    </div>
  );
}
