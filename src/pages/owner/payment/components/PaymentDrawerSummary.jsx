import React from "react";
import StatusBadge from "./StatusBadge";
import ModeBadge from "./ModeBadge";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  Download,
  FileText,
  Banknote,
  Smartphone,
} from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
    <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {label}
    </span>
    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 text-right max-w-[55%] break-words">
      {value ?? "—"}
    </span>
  </div>
);

const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

const PaymentDrawerSummary = ({ payment, isPaid }) => {
  return (
    <div className="px-5 py-5 space-y-5">
      <div className="text-center py-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {fmt(payment.amount)}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <StatusBadge status={payment.status} />
          <ModeBadge mode={payment.paymentMode} />
        </div>
      </div>

      <section>
        <h3 className=" text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Member
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-1">
          <InfoRow
            icon={User}
            label="Name"
            value={`${payment.studentId.firstName} ${payment.studentId.lastName}`}
          />
          <InfoRow icon={Mail} label="Email" value={payment.studentId.email} />
          {payment.studentId.phone && (
            <InfoRow
              icon={Phone}
              label="Phone"
              value={payment.studentId.phone}
            />
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Booking period
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-1">
          <InfoRow
            icon={Calendar}
            label="Start date"
            value={fmtDate(payment.bookingId?.startDate)}
          />
          <InfoRow
            icon={Calendar}
            label="End date"
            value={fmtDate(payment.bookingId?.endDate)}
          />
          <InfoRow
            icon={CheckCircle}
            label="Booking status"
            value={
              <span className="capitalize">{payment.bookingId?.status}</span>
            }
          />
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Payment info
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-1">
          <InfoRow
            icon={Clock}
            label="Created"
            value={fmtDate(payment.createdAt)}
          />
          {isPaid && (
            <InfoRow
              icon={CheckCircle}
              label="Paid on"
              value={fmtDate(payment.paidAt)}
            />
          )}
          {payment.recordedBy && (
            <InfoRow icon={User} label="Recorded by" value="Owner" />
          )}
          {payment.razorpayPaymentId && (
            <InfoRow
              icon={CreditCard}
              label="Razorpay ID"
              value={payment.razorpayPaymentId}
            />
          )}
          {payment.notes && (
            <InfoRow icon={FileText} label="Notes" value={payment.notes} />
          )}
        </div>
      </section>
    </div>
  );
};

export default PaymentDrawerSummary;
