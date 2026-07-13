import { useEffect, useState } from "react";
import { UserX, Phone } from "lucide-react";
import { getAbsentees } from "../../../api/owner.api";

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-700 rounded" />
        <div className="h-3 w-24 bg-slate-100 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}

function initials(name) {
  const parts = name.trim().split(" ").filter(Boolean);
  return parts
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function AbsenteesTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAbsentees()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  //   const grouped = data?.absentees
  //     ? Object.values(
  //         data.absentees.reduce((acc, a) => {
  //           if (!acc[a.studentId]) {
  //             acc[a.studentId] = { ...a, bookingCount: 1 };
  //           } else {
  //             acc[a.studentId].bookingCount += 1;
  //           }
  //           return acc;
  //         }, {}),
  //       )
  //     : [];

  const grouped = data?.absentees;

  return (
    <div className="space-y-4">
      {!loading && data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing today's absentees
          </p>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
            {data.totalAbsent} absent today
          </span>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !grouped.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
            <UserX className="w-7 h-7 text-emerald-500" />
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            No absentees today
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            All booked members have attended today.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map((a) => (
            <div
              key={a.studentId}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 px-4 py-3.5 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {initials(a.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize truncate">
                  {a.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {a.phone}
                </div>
              </div>

              {a.bookingCount > 1 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex-shrink-0">
                  {a?.bookingCount ? a?.bookingCount : ""}{" "}
                  {a?.bookingCount ? "bookings" : ""}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Absent
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
