import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createSeat, createBulkSeats } from "../../../api/owner.api";

const Tab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all
      ${
        active
          ? "bg-amber-500 text-slate-900"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      }`}
  >
    {children}
  </button>
);

const inputClass = (hasError) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm
   text-slate-900 dark:text-white bg-white dark:bg-slate-800/80
   placeholder-slate-400 outline-none transition-all
   ${
     hasError
       ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
       : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
   }`;

const seatTypes = [
  { value: "general", label: "General" },
  { value: "vip", label: "VIP" },
  { value: "window", label: "Window" },
  { value: "cabin", label: "Cabin" },
];

const AddSeatModal = ({ floorId, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Single seat state
  const [seatLabel, setSeatLabel] = useState("");
  const [seatType, setSeatType] = useState("general");
  const [description, setDescription] = useState("");

  // Bulk seat state
  const [prefix, setPrefix] = useState("");
  const [fromNum, setFromNum] = useState("");
  const [toNum, setToNum] = useState("");
  const [bulkType, setBulkType] = useState("general");

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const getBulkPreview = () => {
    if (!prefix.trim() || fromNum === "" || toNum === "") return null;
    const from = Number(fromNum);
    const to = Number(toNum);
    if (from < 1 || to < from || to - from > 99) return null;
    const count = to - from + 1;
    const first = `${prefix.toUpperCase()}${from}`;
    const last = `${prefix.toUpperCase()}${to}`;
    return { first, last, count };
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!seatLabel.trim()) return setError("Seat label is required");
    if (!/^[A-Za-z0-9]+$/.test(seatLabel.trim()))
      return setError(
        "Seat label must contain only letters and numbers (e.g. A1, B12)",
      );

    try {
      setLoading(true);
      await createSeat(floorId, {
        seatLabel: seatLabel.trim().toUpperCase(),
        seatType,
        description: description.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      let seatErr = "Failed to create seat";
      if (err.response?.data?.errors) {
        seatErr = Object.values(err.response?.data?.errors)[0];
      } else {
        seatErr = err.response?.data?.message;
      }
      setError(seatErr);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!prefix.trim()) return setError("Prefix is required (e.g. A, B)");
    if (fromNum === "" || toNum === "")
      return setError("From and To numbers are required");

    const from = Number(fromNum);
    const to = Number(toNum);

    if (from < 1) return setError("From number must be at least 1");
    if (to < from) return setError("To number must be greater than From");
    if (to - from > 99) return setError("Maximum 100 seats per bulk creation");

    try {
      setLoading(true);

      const seats = [];
      for (let i = from; i <= to; i++) {
        seats.push({
          seatLabel: `${prefix.trim().toUpperCase()}${i}`,
          seatType: bulkType,
        });
      }

      const res = await createBulkSeats(floorId, { seats });
      console.log(res);

      const created = res.data?.created || res.created || seats.length;
      const failed = res.data?.failed || res.failed || 0;

      if (failed > 0) {
        setError(`${created} seats created. ${failed} failed to create.`);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create seats");
    } finally {
      setLoading(false);
    }
  };

  const preview = getBulkPreview();

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-2xl flex-shrink-0">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
                Add Seat{activeTab === "bulk" ? "s" : ""}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeTab === "single"
                  ? "Add one seat to this floor"
                  : "Add multiple seats at once"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <Tab
                active={activeTab === "single"}
                onClick={() => {
                  setActiveTab("single");
                  setError("");
                }}
              >
                Single Seat
              </Tab>
              <Tab
                active={activeTab === "bulk"}
                onClick={() => {
                  setActiveTab("bulk");
                  setError("");
                }}
              >
                Bulk Create
              </Tab>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {activeTab === "single" && (
              <form
                id="seatForm"
                onSubmit={handleSingleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      Seat Label *
                    </label>
                    <input
                      placeholder="e.g. A1, B3"
                      value={seatLabel}
                      onChange={(e) =>
                        setSeatLabel(e.target.value.toUpperCase())
                      }
                      maxLength={10}
                      className={inputClass(false)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      Seat Type *
                    </label>
                    <select
                      value={seatType}
                      onChange={(e) => setSeatType(e.target.value)}
                      className={inputClass(false)}
                    >
                      {seatTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                    Description
                    <span className="text-slate-400 font-normal ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    placeholder="e.g. Near window, corner seat"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={200}
                    className={inputClass(false)}
                  />
                </div>
              </form>
            )}

            {activeTab === "bulk" && (
              <form
                id="seatForm"
                onSubmit={handleBulkSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      Prefix *
                    </label>
                    <input
                      placeholder="e.g. A, B, VIP"
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                      maxLength={5}
                      className={inputClass(false)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      Seat Type *
                    </label>
                    <select
                      value={bulkType}
                      onChange={(e) => setBulkType(e.target.value)}
                      className={inputClass(false)}
                    >
                      {seatTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      From *
                    </label>
                    <input
                      type="number"
                      placeholder="1"
                      min="1"
                      value={fromNum}
                      onChange={(e) => setFromNum(e.target.value)}
                      className={inputClass(false)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      To *
                    </label>
                    <input
                      type="number"
                      placeholder="20"
                      min="1"
                      value={toNum}
                      onChange={(e) => setToNum(e.target.value)}
                      className={inputClass(false)}
                    />
                  </div>
                </div>

                {preview && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Will create <strong>{preview.count} seats</strong>:{" "}
                      {preview.first} → {preview.last}
                    </p>
                    <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-0.5">
                      Duplicates will be skipped automatically
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-xl transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="seatForm"
              disabled={loading}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/60 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  {activeTab === "bulk" ? "Creating..." : "Adding..."}
                </>
              ) : activeTab === "bulk" ? (
                `Create ${preview?.count || ""} Seats`
              ) : (
                "Add Seat"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSeatModal;
