import { useState } from "react";
import { X } from "lucide-react";
import SeatInfoSection from "./section/SeatInfoSection";
import BookingInfoSection from "./section/BookingInfoSection";
import EditSeatSection from "./section/EditSeatSection";
import StatusSection from "./section/StatusSection";
import DangerSection from "./section/DangerSection";

import BookingDrawer from "./Bookingdrawer";

const SeatDrawer = ({
  seat: item,
  floor,
  floorId,
  slot,
  slotId,
  onClose,
  onSuccess,
}) => {
  const { seat, gridStatus, dayLeft, bookingDetails } = item;

  const [activeSection, setActiveSection] = useState(null);

  const [showBookingDrawer, setShowBookingDrawer] = useState(false);

  const toggleSection = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleMutationSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleBookingSuccess = () => {
    setShowBookingDrawer(false);
    onSuccess();
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      <div className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-slate-50 dark:bg-slate-900 z-50 flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-700 animate-[slideInRight_0.3s_ease-out]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
              Seat {seat.seatLabel}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {seat.seatType.charAt(0).toUpperCase() + seat.seatType.slice(1)}{" "}
              seat · Floor details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className=" flex-1 overflow-y-auto px-6 py-5 space-y-3">
          <SeatInfoSection seat={seat} gridStatus={gridStatus} />

          {(gridStatus === "booked" || gridStatus === "expiring_soon") && (
            <BookingInfoSection
              bookingDetails={bookingDetails}
              dayLeft={dayLeft}
              gridStatus={gridStatus}
            />
          )}

          <EditSeatSection
            seat={seat}
            floorId={floorId}
            isOpen={activeSection === "edit"}
            onToggle={() => toggleSection("edit")}
            onSuccess={handleMutationSuccess}
          />

          <StatusSection
            seat={seat}
            floorId={floorId}
            isOpen={activeSection === "status"}
            onToggle={() => toggleSection("status")}
            onSuccess={handleMutationSuccess}
          />

          {gridStatus === "available" && slotId && (
            <button
              onClick={() => setShowBookingDrawer(true)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-xl transition-all text-sm"
            >
              Book This Seat
            </button>
          )}

          {gridStatus !== "booked" && gridStatus !== "expiring_soon" && (
            <DangerSection
              seat={seat}
              floorId={floorId}
              onSuccess={handleMutationSuccess}
            />
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 dark:border-slate-700
              text-slate-700 dark:text-slate-300 font-medium rounded-xl
              hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>

      {showBookingDrawer && (
        <BookingDrawer
          seat={seat}
          slotId={slotId}
          floor={floor}
          slot={slot}
          onClose={() => setShowBookingDrawer(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default SeatDrawer;
