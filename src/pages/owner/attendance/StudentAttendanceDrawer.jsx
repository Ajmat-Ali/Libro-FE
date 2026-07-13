import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  Smartphone,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getStudentAttendance } from "../../../api/owner.api";

const LIMIT = 15;

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-28 bg-slate-100 dark:bg-slate-700 rounded" />
        <div className="h-3 w-36 bg-slate-100 dark:bg-slate-700 rounded" />
      </div>
      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-700 rounded-full" />
    </div>
  );
}

export default function StudentAttendanceDrawer({
  studentId,
  studentName,
  onClose,
}) {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const fetchRecords = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getStudentAttendance(studentId, {
        page: p,
        limit: LIMIT,
      });
      const d = res.data;
      setRecords(d.records);
      setTotal(d.total);
      setTotalPages(d.totalPages);
      setPage(p);
    } catch (err) {
      console.error("Failed to fetch student attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(1);
  }, [studentId]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[460px] h-full bg-white dark:bg-slate-800 flex flex-col shadow-xl animate-slideInRight">
        <div className="border-5 flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white capitalize">
              {studentName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Attendance history · {total} record{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : !records.length ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No attendance records found
              </p>
            </div>
          ) : (
            <div>
              {records.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {fmtDate(r.date)}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {r.timeSlotId?.name} · {r.timeSlotId?.startTimeDisplay}{" "}
                        - {r.timeSlotId?.endTimeDisplay}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <Clock className="w-3 h-3" />
                        Entered at {fmtTime(r.entryTime)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        {r.markedHow === "qr_scan" ? (
                          <Smartphone className="w-3 h-3" />
                        ) : (
                          <UserCheck className="w-3 h-3" />
                        )}
                        {r.markedHow === "qr_scan" ? "QR scan" : "Manual"}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Present
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => fetchRecords(page - 1)}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchRecords(page + 1)}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
