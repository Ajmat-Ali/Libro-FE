import SeatCard from "./SeatCard";

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 h-16" />
);

const SeatGrid = ({ seats, loading, error, bothSelected, onSeatClick }) => {
  if (!bothSelected) {
    return (
      <div className="  bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-10 text-center">
        <div className=" grid grid-cols-5 gap-1.5 w-32 mx-auto mb-4 opacity-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-slate-400 dark:bg-slate-500"
            />
          ))}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Select a floor and time slot
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
          to see real-time seat availability
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border-5- bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-500/20 p-8 text-center">
        <p className="text-red-500 dark:text-red-400 text-sm font-medium">
          {error}
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Try changing the filters or refreshing the page
        </p>
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-10 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          No seats found on this floor
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
          Use "Add Seat" to start building the layout
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
      <div className="grid max-392:grid-cols-3 grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 lg:gap-y-5 gap-x-2 gap-y-4">
        {seats.map((item) => (
          <SeatCard
            key={item.seat._id}
            item={item}
            onClick={() => onSeatClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
