import { useState, useEffect, useRef } from "react";
import { X, Search, User, X as XIcon } from "lucide-react";
import { getMembers } from "../../../api/owner.api";

const getTodayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Add 30 days to a date string, return as YYYY-MM-DD
const addThirtyDays = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 30);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const Spinner = ({ size = "w-4 h-4" }) => (
  <svg className={`animate-spin ${size}`} viewBox="0 0 24 24" fill="none">
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

const StudentSearchInput = ({ selectedStudent, onSelect, onClear }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleQueryChange = (value) => {
    setQuery(value);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim() || value.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await getMembers({
          search: value,
          approvalStatus: "approved",
          limit: 8,
        });
        setResults(res.members);
      } catch (error) {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const handleSelect = (student) => {
    onSelect(student);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  if (selectedStudent) {
    return (
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-500/5">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold text-xs">
          {`${selectedStudent.userId?.firstName?.[0] || ""}${selectedStudent.userId?.lastName?.[0] || ""}`.toUpperCase() || (
            <User className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {selectedStudent.userId?.firstName}{" "}
            {selectedStudent.userId?.lastName || ""}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {selectedStudent.phone} · {selectedStudent.membershipId || "No ID"}
          </p>
        </div>

        <button
          onClick={onClear}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 transition-all flex-shrink-0"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search student by name..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm
            text-slate-900 dark:text-white placeholder-slate-400
            bg-white dark:bg-slate-800/80
            border-slate-200 dark:border-slate-700
            focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
            outline-none transition-all"
        />
        {searching && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <Spinner size="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
          {results.map((student) => (
            <button
              key={student._id}
              type="button"
              onClick={() => handleSelect(student)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left border-b border-slate-100 dark:border-slate-700/50 last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold text-xs">
                {`${student.userId?.firstName?.[0] || ""}${student.userId?.lastName?.[0] || ""}`.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {student.userId?.firstName} {student.userId?.lastName || ""}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {student.phone} · {student.membershipId || "No ID"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown &&
        query.length >= 2 &&
        !searching &&
        results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 px-4 py-3 text-xs text-slate-400 text-center">
            No approved members found for "{query}"
          </div>
        )}
    </div>
  );
};

const BookingDrawer = ({ seat, slotId, slot, floor, onClose, onSuccess }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [startDate, setStartDate] = useState(getTodayLocal());
  const endDate = addThirtyDays(startDate);

  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch plan for this seat type + slot on mount ─────────────
  useEffect(() => {
    const fetchPlan = async () => {
      // TODO: call getPlanForSeat({ timeSlotId: slotId, seatType: seat.seatType })
      // then: setPlan(matching plan from results)
      // catch: setPlanError("No plan found for this seat type and slot")
      // finally: setPlanLoading(false)
      setPlanLoading(false);
    };
    fetchPlan();
  }, [seat.seatType, slotId]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!selectedStudent) return setError("Please select a student");
    if (!plan) return setError("No plan available for this seat and slot");
    if (!startDate) return setError("Please select a start date");
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/20 z-[60]" />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-slate-50 dark:bg-slate-900 z-[70] flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-700 animate-[slideInRight_0.25s_ease-out]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
              Book Seat {seat.seatLabel}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {seat.seatType} seat · Monthly plan · 30 days
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
              Student *
            </label>
            <StudentSearchInput
              selectedStudent={selectedStudent}
              onSelect={setSelectedStudent}
              onClear={() => setSelectedStudent(null)}
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Auto-filled
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Seat
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {seat.seatLabel} ({seat.seatType})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Time Slot
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {slot[0].label}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Floor
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {floor[0].label}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Plan & Price
              </span>
              {planLoading ? (
                <Spinner size="w-3 h-3" />
              ) : planError ? (
                <span className="text-xs text-red-500">{planError}</span>
              ) : plan ? (
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {plan.name} · ₹{plan.calculatedPrice}
                </span>
              ) : (
                <span className="text-xs text-slate-400">No plan found</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                min={getTodayLocal()}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm
                  text-slate-900 dark:text-white
                  bg-white dark:bg-slate-800/80
                  border-slate-200 dark:border-slate-700
                  focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                  outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                End Date
                <span className="text-slate-400 font-normal ml-1">
                  (auto · 30 days)
                </span>
              </label>
              <input
                type="date"
                value={endDate}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm
                  text-slate-400 dark:text-slate-500
                  bg-slate-100 dark:bg-slate-800
                  border-slate-200 dark:border-slate-700
                  cursor-not-allowed"
              />
            </div>
          </div>

          {/* ── Price summary card ─────────────────────────── */}
          {plan && selectedStudent && (
            <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                  Total Amount
                </span>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-400 font-['Playfair_Display']">
                  ₹{plan.calculatedPrice}
                </span>
              </div>
              <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-1">
                Cash payment to be recorded separately after booking
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700
              text-slate-700 dark:text-slate-300 font-medium rounded-xl
              hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedStudent || !plan || planLoading}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600
              disabled:bg-amber-500/60 disabled:cursor-not-allowed
              text-slate-900 font-semibold rounded-xl
              transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner /> Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingDrawer;
