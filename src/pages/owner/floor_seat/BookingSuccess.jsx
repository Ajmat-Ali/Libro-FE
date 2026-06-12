import React from "react";

const BookingSuccess = () => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 shadow-lg">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h3 className="font-semibold text-green-800">Booking Confirmed</h3>
          <p className="text-sm text-green-700">
            Your seat has been booked successfully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
