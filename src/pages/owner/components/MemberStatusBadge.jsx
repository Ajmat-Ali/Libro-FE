const StatusBadge = ({ approvalStatus, isActive }) => {
  // if (!isActive) {
  //   return (
  // <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
  //   Suspended
  // </span>
  //   );
  // }
  const config = {
    pending: {
      style:
        "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
      label: "Pending",
    },
    approved: {
      style:
        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      label: "Approved",
    },
    rejected: {
      style: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
      label: "Rejected",
    },
  };

  const c = config[approvalStatus] || config.pending;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.style}`}
    >
      {c.label}
    </span>
  );
};

// ---------------------------------- Active Status ------------------------
const ActiveStatusBadge = ({ isActive }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    ${
      isActive
        ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
        : "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400"
    }`}
    >
      {isActive ? "Active" : "Suspended"}
    </span>
  );
};

export { StatusBadge, ActiveStatusBadge };
