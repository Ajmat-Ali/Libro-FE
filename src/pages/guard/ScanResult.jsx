import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, Calendar, Armchair } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const daysLeft = (endDate) =>
  Math.max(0, Math.ceil((new Date(endDate) - Date.now()) / 86400000));

// Map backend failReason → human-readable message
const FAIL_MESSAGES = {
  invalid_token: "QR code is not recognised",
  qr_expired: "This QR code has expired",
  qr_revoked: "This QR code has been revoked",
  student_suspended: "Member account is suspended",
  default: "Invalid QR code",
};

// ── COUNTDOWN BAR ─────────────────────────────────────────────────
function CountdownBar({ seconds, total, color }) {
  const pct = (seconds / total) * 100;
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SuccessCard({ data, countdown, total }) {
  const student = data?.student ?? {};
  const booking = data?.booking ?? {};
  const seat = booking?.seat ?? {};
  const seatType = booking?.seatType ?? {};
  const slotName = booking?.slotName ?? {};
  const slotStatTime = booking?.startTime ?? {};
  const slotEndTime = booking?.endTime ?? {};
  const validUntil = booking?.validUntil ?? null;
  const days = booking?.validUntil ? daysLeft(booking.validUntil) : null;
  const initials =
    `${student.name?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";

  return (
    <div className="flex flex-col h-full">
      {/* ── Green flash header ── */}
      <div className="bg-emerald-500 px-6 pt-8 pb-6 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-white" />
        </div>
        <div className="text-center">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">
            Entry Granted
          </p>
          <p className="text-white text-2xl font-black mt-0.5 font-['Playfair_Display']">
            Welcome In
          </p>
        </div>
      </div>

      {/* ── Student info ── */}
      <div className="flex-1 bg-slate-900 px-6 py-5 space-y-5 overflow-y-auto">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-emerald-900/40 border-2 border-emerald-500/40 flex items-center justify-center text-xl font-black text-emerald-400 shrink-0">
            {student.photo ? (
              <img
                src={student.photo}
                alt={student.firstName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-white text-lg font-bold leading-tight">
              {student.name}
            </p>
            <p className="text-emerald-400 text-sm font-semibold mt-0.5">
              {student.membershipId ?? student.email ?? "—"}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        <div className="grid grid-cols-2 gap-3">
          {/* Seat */}
          <div className="bg-slate-800 rounded-2xl p-3.5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
              Seat
            </p>
            <p className="text-white font-bold text-lg leading-tight">
              {seat ?? "—"}
            </p>
            <p className="text-slate-400 text-xs capitalize mt-0.5">
              {seatType ?? ""}
            </p>
          </div>

          {/* Slot */}
          <div className="bg-slate-800 rounded-2xl p-3.5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
              Slot
            </p>
            <p className="text-white font-bold text-sm leading-tight">
              {slotName ?? "—"}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              {slotStatTime} – {slotEndTime}
            </p>
          </div>

          {/* Valid until */}
          <div className="bg-slate-800 rounded-2xl p-3.5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
              Valid Until
            </p>
            <p className="text-white font-bold text-sm">
              {fmtDate(booking?.validUntil)}
            </p>
            {days !== null && (
              <p
                className={`text-xs mt-0.5 font-semibold ${
                  days <= 3
                    ? "text-red-400"
                    : days <= 7
                      ? "text-amber-400"
                      : "text-emerald-400"
                }`}
              >
                {days === 0 ? "Expires today" : `${days} days left`}
              </p>
            )}
          </div>

          {/* Entry time */}
          <div className="bg-slate-800 rounded-2xl p-3.5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">
              Entry Time
            </p>
            <p className="text-white font-bold text-sm">
              {new Date().toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FAILURE RESULT ────────────────────────────────────────────────
function FailCard({ failReason, countdown, total }) {
  const message = FAIL_MESSAGES[failReason] ?? FAIL_MESSAGES.default;

  return (
    <div className="flex flex-col h-full">
      {/* ── Red flash header ── */}
      <div className="bg-red-600 px-6 pt-8 pb-6 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
          <XCircle className="w-9 h-9 text-white" />
        </div>
        <div className="text-center">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-widest">
            Access Denied
          </p>
          <p className="text-white text-2xl font-black mt-0.5 font-['Playfair_Display']">
            Entry Blocked
          </p>
        </div>
      </div>

      {/* ── Reason ── */}
      <div className="flex-1 bg-slate-900 px-6 py-8 flex flex-col items-center justify-center gap-4">
        <div className="w-full bg-red-950/50 border border-red-800/40 rounded-2xl p-5 text-center">
          <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Reason
          </p>
          <p className="text-white text-base font-bold">{message}</p>
          {failReason === "qr_expired" && (
            <p className="text-slate-400 text-sm mt-2">
              Student needs to renew their membership
            </p>
          )}
          {failReason === "student_suspended" && (
            <p className="text-slate-400 text-sm mt-2">
              Contact the library owner to reactivate
            </p>
          )}
          {failReason === "qr_revoked" && (
            <p className="text-slate-400 text-sm mt-2">
              Booking was cancelled or membership expired
            </p>
          )}
        </div>

        <p className="text-slate-500 text-sm text-center">
          Ask the student to show their updated QR code or contact the owner
        </p>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function ScanResult({ result, countdown, onReset }) {
  // result shape:
  // { type: "success", data: { student, booking } }
  // { type: "failure", failReason: "qr_expired" | ... }

  const TOTAL = result.type === "success" ? 4 : 3;

  return (
    <div className="absolute inset-0 z-30 flex flex-col overflow-hidden">
      {result.type === "success" ? (
        <SuccessCard data={result.data} countdown={countdown} total={TOTAL} />
      ) : (
        <FailCard
          failReason={result.failReason}
          countdown={countdown}
          total={TOTAL}
        />
      )}

      {/* Manual reset button (skip countdown) */}
      <button
        onClick={onReset}
        className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-colors z-10"
      >
        Scan Again
      </button>
    </div>
  );
}

// ONLY CHANGE THIS MAIN EXPORT PART

// export default function ScanResult({ result, onReset }) {
//   return (
//     <div className="absolute inset-0 z-30 flex flex-col overflow-hidden">
//       {result.type === "success" ? (
//         <SuccessCard data={result.data} />
//       ) : (
//         <FailCard failReason={result.failReason} />
//       )}

//       <button
//         onClick={onReset}
//         className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-colors z-10"
//       >
//         Scan Again
//       </button>
//     </div>
//   );
// }

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
