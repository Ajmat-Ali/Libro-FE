import { CircleFadingPlus, EllipsisVertical, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import UpdateFloorModal from "./UpdateFloorModal";

const FloorOperation = ({
  floors,
  handleDeleteFloor,
  handleUpdateFloorSave,
  updating,
}) => {
  const [open, setOpen] = useState(false);
  const [openMore, setOpenMore] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);

  const handleUpdateModal = (floor) => {
    setSelectedFloor(floor);
    setModalOpen(true);
    setOpenMore(null);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
      <div
        className={`text-slate-900 dark:text-white absolute bottom-16 right-0 w-[280px] sm:w-[320px] rounded-2xl
            border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-2xl
            transition-all duration-300 ease-out origin-bottom-right
            ${
              open
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 translate-y-3 pointer-events-none"
            }
        `}
      >
        <div className=" flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <h2 className="text-sm font-semibold">Floors</h2>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {floors.map((floor, ind) => (
            <div
              key={floor._id}
              className="relative mb-2 flex items-center justify-between rounded-xl px-3 py-2
                hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-all duration-200"
            >
              <div className="truncate text-sm font-medium">{floor.label}</div>

              <div className="relative">
                <div
                  className={`absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden rounded-xl
                    border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800
                    shadow-2xl transition-all duration-300 z-50
                    ${
                      openMore === ind
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible"
                    }
                  `}
                >
                  <button
                    onClick={() => handleUpdateModal(floor)}
                    className="w-full whitespace-nowrap px-4 py-2 text-left text-sm text-blue-600 
                    dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDeleteFloor(floor._id)}
                    className="w-full whitespace-nowrap px-4 py-2 text-left text-sm text-red-600 dark:text-red-400
                      hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <button
                  onClick={() => {
                    setOpenMore(openMore === ind ? null : ind);
                  }}
                  className={`rounded-lg p-1.5 transition-all duration-200
                    ${
                      openMore === ind
                        ? "bg-slate-200 dark:bg-slate-700"
                        : "hover:bg-slate-200 dark:hover:bg-slate-700"
                    }
                  `}
                >
                  <EllipsisVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-white p-3
          text-white dark:text-slate-900 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <CircleFadingPlus
          size={28}
          className={`transition-transform duration-300 ${
            open ? "rotate-135" : "rotate-0"
          }`}
        />
      </button>

      <UpdateFloorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        floor={selectedFloor}
        onSave={handleUpdateFloorSave}
        updating={updating}
      />
    </div>
  );
};

export default FloorOperation;
