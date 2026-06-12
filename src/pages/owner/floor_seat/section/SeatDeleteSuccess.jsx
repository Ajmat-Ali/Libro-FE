import React from "react";

const SeatDeleteSuccess = ({ close }) => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 shadow-lg">
        <div
          onClick={close}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div>
          <h3 className="font-semibold text-red-800">Seat Deleted</h3>
          <p className="text-sm text-red-700">
            The selected seat has been removed successfully.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatDeleteSuccess;
