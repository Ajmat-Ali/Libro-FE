import { CheckCircle2, IndianRupee, Wallet, AlertCircle } from "lucide-react";
import { formatDate } from "../../../utils/dateUtils";

const PaymentSection = ({ payment }) => {
  const isPaid = payment.status === "paid";
  const isCashPending =
    payment.status === "pending" && payment.paymentMode === "cash";
  const isOnlinePending =
    payment.status === "pending" && payment.paymentMode === "online";

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
        Payment Details
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <IndianRupee size={15} />
          Amount
        </div>
        <span className="text-lg font-semibold text-slate-900 dark:text-white">
          ₹{payment.amount}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <Wallet size={15} />
          Mode
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize">
          {payment.paymentMode || "—"}
        </span>
      </div>

      {isPaid && (
        <div className="flex items-center gap-2 mt-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium px-3 py-2.5 rounded-lg">
          <CheckCircle2 size={16} />
          Paid on {formatDate(payment.paidAt)}
        </div>
      )}

      {isCashPending && (
        <div className="flex items-start gap-2 mt-4 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm px-3 py-2.5 rounded-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            Please pay <strong>₹{payment.amount}</strong> in cash at the library
            counter to complete this booking.
          </span>
        </div>
      )}

      {isOnlinePending && (
        <div className="flex items-start gap-2 mt-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-3 py-2.5 rounded-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            Your online payment wasn't completed. Please contact the library to
            resolve this.
          </span>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
