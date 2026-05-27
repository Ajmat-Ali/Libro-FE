import { Shield, Loader2, ShieldOff } from "lucide-react";

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700/50">
      {[60, 70, 50, 40].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3.5 rounded animate-pulse bg-slate-100 dark:bg-slate-700"
            style={{ width: `${w}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Inactive
    </span>
  );
}

export default function GuardsList({
  guards,
  loading,
  deactivating,
  onDeactivate,
}) {
  if (loading) {
    return (
      <div className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
              {["Name", "Email", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (guards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
        <Shield className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
          No guards created yet
        </p>
        <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
          Add a guard account using the form below
        </p>
      </div>
    );
  }

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
      {/* Scroll wrapper */}
      <div className="overflow-x-auto overflow-y-auto max-h-[450px]">
        <table className="w-full min-w-[700px]">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800/95">
            <tr className="border-b border-slate-100 dark:border-slate-700">
              {["Guard", "Email", "Status", "Action"].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${
                    i === 3 ? "text-right" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {guards.map((g) => (
              <tr
                key={g._id}
                className="border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors last:border-0"
              >
                {/* Name */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0">
                      {g.firstName?.[0]?.toUpperCase() ?? "G"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {g.firstName} {g.lastName}
                      </p>

                      <p className="text-xs text-slate-400">
                        Added {fmtDate(g.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {g.email}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <StatusBadge isActive={g.isActive} />
                </td>

                {/* Action */}
                <td className="px-4 py-3.5 text-right">
                  {g.isActive && (
                    <button
                      onClick={() => onDeactivate(g._id)}
                      disabled={deactivating[g._id]}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 transition-colors"
                    >
                      {deactivating[g._id] ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ShieldOff className="w-3 h-3" />
                      )}
                      {deactivating[g._id] ? "Deactivating…" : "Deactivate"}
                    </button>
                  )}
                  {!g.isActive && (
                    <span className="text-xs text-slate-300 dark:text-slate-600">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
