import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  getGuards,
  createGuard,
  deactivateGuard,
} from "../../../../api/owner.api";
import GuardsList from "./GuardList";
import CreateGuardForm from "./CreateGuardForm";

function GuardsSection() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);

  // per-guard deactivation loading: { [guardId]: true }
  const [deactivating, setDeactivating] = useState({});

  // global toast for this section
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getGuards();
        setGuards(res.data.guards ?? []);
      } catch {
        showToast("error", "Failed to load guards");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDeactivate = async (guardId) => {
    setDeactivating((p) => ({ ...p, [guardId]: true }));
    try {
      await deactivateGuard(guardId);
      setGuards((prev) =>
        prev.map((g) => (g._id === guardId ? { ...g, isActive: false } : g)),
      );
      showToast("success", "Guard deactivated — their access has been revoked");
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message ?? "Failed to deactivate guard",
      );
    } finally {
      setDeactivating((p) => ({ ...p, [guardId]: false }));
    }
  };

  const handleGuardCreated = (newGuard) => {
    setGuards((prev) => [newGuard, ...prev]);
    showToast("success", `Guard account created for ${newGuard.firstName}`);
  };

  return (
    <div className="p-6 space-y-7">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
            Guard Accounts
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Guards can only scan QR codes at entry — no other access
          </p>
        </div>

        {/* Live count chip */}
        {!loading && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {guards.filter((g) => g.isActive).length} active
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-xs text-slate-400">
              {guards.length} total
            </span>
          </div>
        )}
      </div>

      <GuardsList
        guards={guards}
        loading={loading}
        deactivating={deactivating}
        onDeactivate={handleDeactivate}
      />

      {toast && (
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            toast.type === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      <CreateGuardForm
        onSuccess={handleGuardCreated}
        onError={(msg) => showToast("error", msg)}
      />
    </div>
  );
}

export default GuardsSection;
