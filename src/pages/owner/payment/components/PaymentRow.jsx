import { CheckCircle, Eye } from "lucide-react";
import ModeBadge from "./ModeBadge";
import StatusBadge from "./StatusBadge";

function PaymentRow({ payment, onView, onRecord, fmt, fmtDate }) {
  const p = payment;
  const name = `${p.studentId.firstName} ${p.studentId.lastName}`;

  const initials =
    (p.studentId.firstName?.[0] || "") + (p.studentId.lastName?.[0] || "");

  const isPendingCash = p.status === "pending" && p.paymentMode === "cash";

  const date = p.status === "paid" ? p.paidAt : p.createdAt;

  return (
    <tr
      onClick={onView}
      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
              {name}
            </p>
            <p className="text-xs text-slate-400 truncate hidden md:block">
              {p.studentId.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
        {fmt(p.amount)}
      </td>

      <td className="px-4 py-3.5 hidden sm:table-cell">
        <ModeBadge mode={p.paymentMode} />
      </td>

      <td className="px-4 py-3.5">
        <StatusBadge status={p.status} />
      </td>

      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 hidden md:table-cell">
        {fmtDate(date)}
      </td>

      <td
        className="px-4 py-3.5 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {isPendingCash ? (
          <button
            onClick={onRecord}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-500/20 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Mark Paid
          </button>
        ) : (
          <button
            onClick={onView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        )}
      </td>
    </tr>
  );
}

export default PaymentRow;
