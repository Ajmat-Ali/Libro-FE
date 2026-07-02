import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const UpdateFloorModal = ({ open, onClose, floor, onSave, updating }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(floor?.raw?.name || "");
  }, [floor?.raw?.name]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!open) return null;

  const handleSave = async () => {
    try {
      await onSave({ value: value, id: floor?._id });
      onClose();
    } catch (error) {
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-2 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Update Floor
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Floor Name
          </label>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter floor name"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800
              px-4 py-3 text-slate-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 
              focus:ring-blue-500/20 transition-all
            "
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5
              text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={!value.trim() || updating}
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700
             disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          >
            {updating ? "Saving..." : " Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateFloorModal;
