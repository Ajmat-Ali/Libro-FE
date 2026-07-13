import { useState, useEffect, useCallback } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { getDailyAttendance } from "../../../api/owner.api";
import AttendanceStatCards from "./AttendanceStatCards";

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fmtEntryTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({ status }) {
  if (status === "present")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Present
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Absent
    </span>
  );
}

export default function DailyReportTab({ onViewStudent }) {
  const [selectedDate, setSelectedDate] = useState(toLocalDateStr(new Date()));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async (dateStr) => {
    setLoading(true);
    try {
      const res = await getDailyAttendance(dateStr);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch daily attendance:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate, fetchReport]);

  const goDay = (offset) => {
    const d = new Date(selectedDate);

    d.setDate(d.getDate() + offset);

    setSelectedDate(toLocalDateStr(d));
  };

  const isToday = selectedDate === toLocalDateStr(new Date());
  const displayDate = new Date(selectedDate).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 flex items-center justify-between gap-3">
        <button
          onClick={() => goDay(-1)}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className=" flex items-center gap-3 flex-1 justify-center">
          <CalendarDays className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <div className="text-center">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              {displayDate}
            </p>
            {isToday && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Today
              </span>
            )}
          </div>

          <input
            type="date"
            value={selectedDate}
            max={toLocalDateStr(new Date())}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="absolute opacity-0 w-0 h-0"
            id="date-picker"
          />
          <label
            htmlFor="date-picker"
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            title="Pick a date"
          >
            <CalendarDays className="w-3.5 h-3.5" />
          </label>
        </div>

        <button
          onClick={() => goDay(1)}
          disabled={isToday}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <AttendanceStatCards summary={data?.summary} loading={loading} />

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                  Seat
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  Slot
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                  Entry time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : !data?.report?.length ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 dark:text-slate-500 text-sm">
                      No bookings found for this date
                    </p>
                  </td>
                </tr>
              ) : (
                data.report.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() =>
                      onViewStudent?.(row.student.id, row.student.name)
                    }
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                        {row.student.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {row.student.phone}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                        {row.seat}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {row.slot}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>

                    <td className="px-4 py-3.5 hidden sm:table-cell text-sm text-slate-500 dark:text-slate-400">
                      {row.entryTime ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {fmtEntryTime(row.entryTime)}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
