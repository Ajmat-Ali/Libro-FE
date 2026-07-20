const STYLES = {
  paid: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  not_found:
    "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
};

const LABELS = {
  paid: "Paid",
  pending: "Payment Pending",
  not_found: "No Payment Record",
};

const PaymentBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${
      STYLES[status] || STYLES.not_found
    }`}
  >
    {LABELS[status] || "Unknown"}
  </span>
);

export default PaymentBadge;
