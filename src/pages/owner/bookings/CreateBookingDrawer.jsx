// CreateBookingDrawer.jsx
// Place at: src/pages/owner/bookings/CreateBookingDrawer.jsx
// (Create the bookings/ folder inside owner/ if it doesn't exist)
//
// Make sure these are in owner.api.js:
//   getFloors, getSeats(floorId), getSlots, getPlans, createBooking, getMembers

import { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import {
  getMembers,
  getFloors,
  getSeats,
  getSlots,
  getPlans,
  createBooking,
} from "../../../api/owner.api";

// ── HELPERS ───────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

// ── STEP INDICATOR ────────────────────────────────────────────────
function StepDot({ n, active, done }) {
  return (
    <div className="flex items-center">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          done
            ? "bg-emerald-500 text-white"
            : active
              ? "bg-amber-500 text-white ring-4 ring-amber-500/20"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400"
        }`}
      >
        {done ? "✓" : n}
      </div>
    </div>
  );
}

// ── SECTION LABEL ─────────────────────────────────────────────────
function SectionLabel({ step, current, children }) {
  const done = current > step;
  const active = current === step;
  return (
    <label
      className={`block text-sm font-semibold mb-1.5 transition-colors ${
        active
          ? "text-slate-800 dark:text-white"
          : done
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-slate-400 dark:text-slate-600"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] mr-1.5 ${
          done
            ? "bg-emerald-500"
            : active
              ? "bg-amber-500"
              : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        {done ? "✓" : step}
      </span>
      {children}
    </label>
  );
}

// ── MAIN DRAWER ───────────────────────────────────────────────────
export default function CreateBookingDrawer({ onClose, onSuccess }) {
  // ── Student search state ────────────────────────────────────────
  const [studentSearch, setStudentSearch] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ── Seat selection state ────────────────────────────────────────
  const [floors, setFloors] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState("");
  const [seats, setSeats] = useState([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState("");

  // ── Slot & plan state ───────────────────────────────────────────
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [plans, setPlans] = useState([]);
  const [matchedPlan, setMatchedPlan] = useState(null);

  // ── Date state ──────────────────────────────────────────────────
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // ── Submit state ────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");

  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);

  // ---------------- Load floors, slots, plans on mount --------------------------
  useEffect(() => {
    Promise.all([getFloors(), getSlots(), getPlans()])
      .then(([fRes, sRes, pRes]) => {
        setFloors((fRes.data.floors ?? []).filter((f) => f.isActive));
        setSlots((sRes.data.slots ?? []).filter((s) => s.isActive));
        setPlans(pRes.data.plans ?? []);
      })
      .catch((err) => {
        setServerError(err.message);
      });
  }, []);

  // -------------------- Load seats when floor changes --------------------------
  useEffect(() => {
    if (!selectedFloorId) {
      setSeats([]);
      setSelectedSeatId("");
      return;
    }
    setSeatsLoading(true);
    getSeats(selectedFloorId)
      .then((res) => {
        setSeats((res.data.seats ?? []).filter((s) => s.status === "active"));
        setSelectedSeatId("");
      })
      .catch((err) => setServerError(err.message))
      .finally(() => setSeatsLoading(false));
  }, [selectedFloorId]);

  // ------------------- Match plan when seat + slot selected --------------------------
  useEffect(() => {
    if (!selectedSeatId || !selectedSlotId) {
      setMatchedPlan(null);
      return;
    }
    const seat = seats.find((s) => s._id === selectedSeatId);
    if (!seat) return;

    const plan = plans.find((p) => {
      // timeSlotId may be a string ID or populated object
      const slotId =
        typeof p.timeSlotId === "object" ? p.timeSlotId._id : p.timeSlotId;
      return (
        p.seatType === seat.seatType && slotId === selectedSlotId && p.isActive
      );
    });
    setMatchedPlan(plan ?? null);
  }, [selectedSeatId, selectedSlotId, seats, plans]);

  // ── Student search (debounced 400ms) ───────────────────────────
  const handleStudentSearch = (val) => {
    setStudentSearch(val);
    setShowStudentDropdown(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!val.trim()) {
      setStudentResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setStudentLoading(true);
      try {
        // Only search approved members
        const res = await getMembers({
          search: val.trim(),
          approvalStatus: "approved",
          limit: 8,
        });

        setStudentResults(res?.members ?? []);
      } catch (err) {
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

  // Escape key to close drawer
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ── Derived values ──────────────────────────────────────────────
  const endDate = startDate
    ? new Date(new Date(startDate).getTime() + 30 * 86400000)
        .toISOString()
        .split("T")[0]
    : "";

  const selectedSeat = seats.find((s) => s._id === selectedSeatId);
  const selectedSlot = slots.find((s) => s._id === selectedSlotId);

  // Determine current "step" for progress indicators
  const currentStep = !selectedStudent
    ? 1
    : !selectedSeatId
      ? 2
      : !selectedSlotId
        ? 3
        : 4;

  // ------------------------  Submit ---------------------------
  const handleSubmit = async () => {
    setError("");

    if (!selectedStudent) {
      setError("Please select a student");
      return;
    }
    if (!selectedSeatId) {
      setError("Please select a seat");
      return;
    }
    if (!selectedSlotId) {
      setError("Please select a time slot");
      return;
    }
    if (!matchedPlan) {
      setError("No active plan for this combination");
      return;
    }
    if (!startDate) {
      setError("Please pick a start date");
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        studentId: selectedStudent.userId._id,
        seatId: selectedSeatId,
        timeSlotId: selectedSlotId,
        planId: matchedPlan._id,
        startDate,
      });
      onSuccess();
    } catch (err) {
      //   setError(
      //     err.response?.data?.message ??
      //       "Failed to create booking. Please try again.",
      //   );
      setServerError(
        err.response?.data?.message ??
          "Failed to create booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[460px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-[slideInRight_0.28s_cubic-bezier(0.4,0,0.2,1)]">
        <div className="sticky">
          {serverError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {serverError}
              </p>
            </div>
          )}
        </div>
        {/* ----------------------- Drawer Header ------------------------ */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
              New Booking
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create a booking directly for a student
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body (scrollable) ─────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* ─── STEP 1: Student ───────────────────────── */}
          <div>
            <SectionLabel step={1} current={currentStep}>
              Select Student
            </SectionLabel>

            {selectedStudent ? (
              /* Selected state */
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                <div className="w-9 h-9 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-sm font-bold text-amber-800 dark:text-amber-200 shrink-0 overflow-hidden">
                  {(
                    selectedStudent.userId?.firstName?.[0] ?? "?"
                  ).toUpperCase()}
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
            ) : (
              /* Search state */
              <div ref={dropdownRef} className="relative">
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
                {/* Results dropdown */}
                {showStudentDropdown && studentSearch && (
                  <div className="absolute z-10 mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    {studentLoading ? (
                      <div className="px-4 py-3.5 text-sm text-slate-400 flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        Searching…
                      </div>
                    ) : studentResults.length === 0 ? (
                      <div className="px-4 py-3.5 text-sm text-slate-400">
                        No approved students found
                      </div>
                    ) : (
                      studentResults.map((m) => (
                        <button
                          key={m._id}
                          onClick={() => {
                            setSelectedStudent(m);
                            setShowStudentDropdown(false);
                            setStudentSearch("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0">
                            {(m.userId?.firstName?.[0] ?? "?").toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {m.userId?.firstName} {m.userId?.lastName}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {m.membershipId ?? m.userId?.email}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --------------- STEP 2: Floor + Seat ------------------------ */}
          <div
            className={selectedStudent ? "" : "opacity-40 pointer-events-none"}
          >
            <SectionLabel step={2} current={currentStep}>
              Select Seat
            </SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {/* Floor */}
              <div>
                <select
                  value={selectedFloorId}
                  onChange={(e) => {
                    setSelectedFloorId(e.target.value);
                    setSelectedSeatId("");
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50"
                >
                  <option value="">— Floor —</option>
                  {floors.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Seat */}
              <div>
                <select
                  value={selectedSeatId}
                  onChange={(e) => setSelectedSeatId(e.target.value)}
                  disabled={!selectedFloorId || seatsLoading}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50"
                >
                  <option value="">
                    {seatsLoading
                      ? "Loading…"
                      : seats.length === 0 && selectedFloorId
                        ? "No active seats"
                        : "— Seat —"}
                  </option>
                  {seats.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.seatLabel} ({s.seatType})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedSeat && (
              <p className="text-xs text-slate-400 mt-1.5 ml-0.5 flex items-center gap-1">
                Seat type:
                <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize ml-1">
                  {selectedSeat.seatType}
                </span>
              </p>
            )}
          </div>

          {/* ─── STEP 3: Time Slot ─────────────────────── */}
          <div
            className={selectedSeatId ? "" : "opacity-40 pointer-events-none"}
          >
            <SectionLabel step={3} current={currentStep}>
              Time Slot
            </SectionLabel>
            <select
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="">— Select Time Slot —</option>
              {slots.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.startTimeDisplay} – {s.endTimeDisplay})
                </option>
              ))}
            </select>

            {/* No plan warning */}
            {selectedSeatId && selectedSlotId && !matchedPlan && (
              <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                  No active plan for{" "}
                  <strong className="capitalize">
                    {selectedSeat?.seatType}
                  </strong>{" "}
                  seats in <strong>{selectedSlot?.name}</strong>. Go to{" "}
                  <strong>Slots & Plans</strong> to create one first.
                </p>
              </div>
            )}
          </div>

          {/* ─── STEP 4: Start Date ────────────────────── */}
          <div
            className={
              selectedSlotId && matchedPlan
                ? ""
                : "opacity-40 pointer-events-none"
            }
          >
            <SectionLabel step={4} current={currentStep}>
              Start Date
            </SectionLabel>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            {endDate && (
              <p className="text-xs text-slate-400 mt-1.5 ml-0.5">
                Booking ends{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {fmtDate(endDate)}
                </span>{" "}
                (30 days)
              </p>
            )}
          </div>

          {/* ─── Summary Card ──────────────────────────── */}
          {selectedStudent &&
            selectedSeat &&
            selectedSlot &&
            matchedPlan &&
            startDate && (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                  <p className="text-white text-xs font-bold uppercase tracking-widest">
                    Booking Summary
                  </p>
                </div>
                <div className="bg-amber-50/60 dark:bg-amber-900/10 px-4 py-4 space-y-2.5 text-sm">
                  {[
                    [
                      "Student",
                      `${selectedStudent.userId?.firstName} ${selectedStudent.userId?.lastName}`,
                    ],
                    [
                      "Seat",
                      `${selectedSeat.seatLabel} (${selectedSeat.seatType})`,
                    ],
                    [
                      "Time Slot",
                      `${selectedSlot.name} · ${selectedSlot.startTimeDisplay} – ${selectedSlot.endTimeDisplay}`,
                    ],
                    ["Duration", `${fmtDate(startDate)} → ${fmtDate(endDate)}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3">
                      <span className="text-slate-400 dark:text-slate-500 shrink-0">
                        {label}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-white text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-amber-200 dark:border-amber-800/40 pt-2.5 flex justify-between items-center">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Monthly Fee
                    </span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      ₹{matchedPlan.calculatedPrice}
                    </span>
                  </div>
                </div>
              </div>
            )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* ── Footer ────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !selectedStudent ||
              !selectedSeatId ||
              !selectedSlotId ||
              !matchedPlan ||
              !startDate
            }
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Create Booking
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
