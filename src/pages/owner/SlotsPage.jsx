import { useState, useEffect, useCallback } from "react";
import { Clock, Plus, CheckCircle } from "lucide-react";
import { getSlots, getPlans } from "../../api/owner.api";
import SlotsTab from "./slots/SlotsTab";
import PlansTab from "./slots/PlansTab";
import SlotFormModal from "./slots/SlotFormModal";
import DeleteSlotModal from "./slots/DeleteSlotModal";

export default function SlotsPage() {
  const [activeTab, setActiveTab] = useState("slots");

  const [slots, setSlots] = useState([]);
  const [plans, setPlans] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotError, setSlotError] = useState("");
  const [plansLoading, setPlansLoading] = useState(true);
  const [planError, setPlanError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchSlots = useCallback(async () => {
    setSlotsLoading(true);
    try {
      const res = await getSlots();
      setSlots(res.data.slots);
      setSlotError("");
    } catch (err) {
      console.error("Failed to fetch slots:", err.message);
      setSlotError("Failed to fetch slots:", err.message);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const res = await getPlans();
      setPlans(res.data.plans);
      setPlanError("");
    } catch (err) {
      console.error("Failed to fetch plans:", err.message);
      setPlanError("Failed to fetch plans:", err.message);
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
    fetchPlans();
  }, [fetchSlots, fetchPlans]);

  const handleSlotCreated = () => {
    setShowCreate(false);
    showToast("Slot created — plans auto-generated");
    fetchSlots();
    fetchPlans();
  };

  const handleSlotUpdated = () => {
    setEditingSlot(null);
    showToast("Slot updated successfully");
    fetchSlots();
  };

  const handleSlotDeleted = () => {
    setDeletingSlot(null);
    showToast("Slot deleted");
    fetchSlots();
    fetchPlans();
  };

  // Optimistic toggle — flip locally, no re-fetch needed
  const handlePlanToggled = (planId) => {
    setPlans((prev) =>
      prev.map((p) => (p._id === planId ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  return (
    <div className="font-['DM_Sans'] min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className=" bg-slate-900 px-4 lg:px-6 pt-6 pb-16">
        <div className="flex items-center gap-3 mb-1">
          <Clock className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white font-['Playfair_Display']">
            Slots &amp; Plans
          </h1>
        </div>
        <p className="text-slate-400 text-sm">
          Manage time slots and view auto-generated pricing plans
        </p>
      </div>

      <div className="border-4- px-4 lg:px-6 -mt-10 pb-10">
        <div className=" flex items-center justify-between mb-5">
          <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-1">
            <TabButton
              label="Time slots"
              count={slots.length}
              active={activeTab === "slots"}
              onClick={() => setActiveTab("slots")}
            />
            <TabButton
              label="Plans"
              count={plans.length}
              active={activeTab === "plans"}
              onClick={() => setActiveTab("plans")}
            />
          </div>
        </div>

        {activeTab === "slots" ? (
          <SlotsTab
            slots={slots}
            loading={slotsLoading}
            onEdit={(slot) => setEditingSlot(slot)}
            onDelete={(slot) => setDeletingSlot(slot)}
            error={slotError}
          />
        ) : (
          <PlansTab
            plans={plans}
            loading={plansLoading}
            onToggled={handlePlanToggled}
            error={planError}
          />
        )}
      </div>

      {activeTab === "slots" && (
        <button
          onClick={() => setShowCreate(true)}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
          aria-label="Add time slot"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}

      {showCreate && (
        <SlotFormModal
          slot={null}
          onClose={() => setShowCreate(false)}
          onSuccess={handleSlotCreated}
        />
      )}

      {editingSlot && (
        <SlotFormModal
          slot={editingSlot}
          onClose={() => setEditingSlot(null)}
          onSuccess={handleSlotUpdated}
        />
      )}

      {deletingSlot && (
        <DeleteSlotModal
          slot={deletingSlot}
          onClose={() => setDeletingSlot(null)}
          onSuccess={handleSlotDeleted}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-emerald-400 border border-emerald-500/30 text-sm font-medium shadow-lg">
          <CheckCircle className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Tab button ────────────────────────────────────────────────────
function TabButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-slate-900 dark:bg-slate-700 text-white shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
      }`}
    >
      {label}
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
          active
            ? "bg-white/20 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
