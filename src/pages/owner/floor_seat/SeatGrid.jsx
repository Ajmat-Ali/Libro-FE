// ─────────────────────────────────────────────────────────────
// SeatGrid.jsx
// Renders the full grid of SeatCards
// Handles 3 states: no filter selected / loading / data loaded
// Also shows legend and summary bar
// ─────────────────────────────────────────────────────────────

// import SeatCard, { SeatCardSkeleton } from "./SeatCard";

// ── Legend items — shown below grid ──────────────────────────
const LEGEND_ITEMS = [
  { color: "bg-green-400", label: "Available" },
  { color: "bg-red-400", label: "Booked" },
  { color: "bg-orange-400", label: "Expiring Soon" },
  { color: "bg-yellow-400", label: "Maintenance / Reserved" },
  { color: "bg-slate-300", label: "Disabled" },
];

// ── Summary pill component ────────────────────────────────────
const SummaryPill = ({ label, count, color }) => (
  <div
    className={`
    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
    bg-white dark:bg-slate-800
    border border-slate-200 dark:border-slate-700
    text-slate-700 dark:text-slate-300
  `}
  >
    <span className={`w-2 h-2 rounded-full ${color}`} />
    <span>{label}</span>
    <span className="font-bold text-slate-900 dark:text-white">{count}</span>
  </div>
);

// ── Placeholder shown when floor+slot not yet selected ────────
const GridPlaceholder = () => (
  <div
    className="
    flex flex-col items-center justify-center
    py-24 text-center
  "
  >
    {/* Grid icon */}
    <div
      className="
      w-16 h-16 rounded-2xl mb-4
      bg-amber-50 dark:bg-amber-900/20
      flex items-center justify-center
    "
    >
      <svg
        className="w-8 h-8 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    </div>
    <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg font-[Playfair_Display]">
      Select a floor and time slot
    </p>
    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-xs">
      Choose both filters above to see real-time seat availability for that slot
    </p>
  </div>
);

// ── Skeleton grid shown while API call is in progress ─────────
const GridSkeleton = () => (
  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2">
    {/* Render 20 skeleton cards */}
    {Array.from({ length: 20 }).map((_, i) => (
      <SeatCardSkeleton key={i} />
    ))}
  </div>
);

// ── Main SeatGrid component ───────────────────────────────────
const SeatGrid = ({
  seats, // array from API response
  summary, // summary object from API response
  loading, // boolean — API call in progress
  hasFilter, // boolean — both floor+slot are selected
  onSeatClick, // function — called when seat card clicked
}) => {
  // ── State 1: No filter selected yet ──────────────────────
  if (!hasFilter) {
    return <GridPlaceholder />;
  }

  // ── State 2: Loading ──────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Summary bar skeleton */}
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
        <GridSkeleton />
      </div>
    );
  }

  // ── State 3: Data loaded ──────────────────────────────────
  return (
    <div className="space-y-4">
      {/* ── Summary bar ── */}
      {summary && (
        <div className="flex flex-wrap gap-2">
          <SummaryPill
            label="Total"
            count={summary.total}
            color="bg-slate-400"
          />
          <SummaryPill
            label="Available"
            count={summary.available}
            color="bg-green-400"
          />
          <SummaryPill
            label="Booked"
            count={summary.booked}
            color="bg-red-400"
          />
          <SummaryPill
            label="Expiring Soon"
            count={summary.expiringSoon}
            color="bg-orange-400"
          />
          <SummaryPill
            label="Maintenance"
            count={summary.maintenance}
            color="bg-yellow-400"
          />
          <SummaryPill
            label="Reserved"
            count={summary.reserved}
            color="bg-yellow-400"
          />
          <SummaryPill
            label="Disabled"
            count={summary.disabled}
            color="bg-slate-300"
          />
        </div>
      )}

      {/* ── Empty state — floor+slot selected but no seats added yet ── */}
      {seats.length === 0 ? (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400">
          <p className="font-medium">No seats on this floor yet</p>
          <p className="text-sm mt-1">
            Click "Add Seat" to create seats for this floor
          </p>
        </div>
      ) : (
        // ── Seat grid ──
        // Responsive: 4 cols mobile / 6 cols tablet / 10 cols desktop
        // Matches our decision: Desktop→10, Tablet→6, Mobile→4
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2">
          {seats.map((seatData) => (
            <SeatCard
              key={seatData.seat._id}
              seatData={seatData}
              onSeatClick={onSeatClick}
            />
          ))}
        </div>
      )}

      {/* ── Legend ── */}
      <div
        className="
        flex flex-wrap gap-3 pt-4
        border-t border-slate-200 dark:border-slate-700
      "
      >
        <span className="text-xs text-slate-500 dark:text-slate-400 self-center">
          Legend:
        </span>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
