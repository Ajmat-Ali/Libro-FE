import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createFloor } from "../../../api/owner.api";

const AddFloorModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm
     text-slate-900 dark:text-white bg-white dark:bg-slate-800/80
     placeholder-slate-400 outline-none transition-all
     ${
       hasError
         ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
         : "border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
     }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Floor name is required");
    if (name.trim().length < 2)
      return setError("Floor name must be at least 2 characters");
    if (number === "" || number === null)
      return setError("Floor number is required");
    if (Number(number) < 0) return setError("Floor number cannot be negative");

    try {
      setLoading(true);
      await createFloor({
        name: name.trim(),
        number: Number(number),
        description: description.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      let normErr = "Failed to create floor. Try again.";
      if (err.response?.data?.errors) {
        normErr = Object.values(err.response?.data?.errors)[0];
      } else {
        normErr = err.response?.data?.message;
      }
      setError(normErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-2xl">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
                Add New Floor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Floor 0 = Ground floor, 1 = First floor, etc.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Floor Name *
                </label>
                <input
                  placeholder="e.g. Ground Floor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className={inputClass(!name.trim() && error)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Floor Number *
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className={inputClass(number === "" && error)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                Description
                <span className="text-slate-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. AC floor with window seats"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                className={`${inputClass(false)} resize-none`}
              />
            </div>
          </form>

          <div className=" px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium rounded-xl transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
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
                  Creating...
                </>
              ) : (
                "Create Floor"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFloorModal;
