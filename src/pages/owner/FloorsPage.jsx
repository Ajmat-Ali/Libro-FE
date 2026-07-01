import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  LayoutGrid,
  CircleFadingPlus,
  EllipsisVertical,
} from "lucide-react";
import { getFloors, getSlots, getSeatGrid } from "../../api/owner.api";
import SeatGrid from "./floor_seat/SeatGrid";
import AddFloorModal from "./floor_seat/AddFloorModel";
import AddSeatModal from "./floor_seat/AddSeatModel";
import SeatDrawer from "./floor_seat/SeatDrawer";

const getTodayLocal = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const Spinner = ({ size = "w-4 h-4" }) => (
  <svg className={`animate-spin ${size}`} viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const SummaryBar = ({ summary }) => {
  if (!summary) return null;

  const pills = [
    {
      key: "available",
      label: "Available",
      color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "booked",
      label: "Booked",
      color: "bg-red-500/15 text-red-600 dark:text-red-400",
    },
    {
      key: "expiringSoon",
      label: "Expiring Soon",
      color: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    },
    {
      key: "maintenance",
      label: "Maintenance",
      color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    },
    {
      key: "reserved",
      label: "Reserved",
      color: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    },
    {
      key: "disabled",
      label: "Disabled",
      color: "bg-slate-500/15 text-slate-500 dark:text-slate-400",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-center mr-1">
        {summary.total} seats
      </span>

      {pills.map(({ key, label, color }) => {
        if (!summary[key]) return null;
        return (
          <span
            key={key}
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${color}`}
          >
            {summary[key]} {label}
          </span>
        );
      })}
    </div>
  );
};

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => (
  <div className="flex-1 min-w-[160px]">
    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3.5 py-2.5 rounded-xl border text-sm
        text-slate-900 dark:text-white
        bg-white dark:bg-slate-800
        border-slate-200 dark:border-slate-700
        focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
        outline-none transition-all
        disabled:opacity-50 disabled:cursor-not-allowed "
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o._id} value={o._id}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const FloorsPage = () => {
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());

  const [floors, setFloors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [seats, setSeats] = useState([]);
  const [summary, setSummary] = useState(null);
  const [gridFloor, setGridFloor] = useState(null);
  const [gridSlot, setGridSlot] = useState(null);

  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [gridError, setGridError] = useState("");

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddFloor, setIsAddFloor] = useState(false);
  const [isAddSeat, setIsAddSeat] = useState(false);

  const [open, setOpen] = useState(false);
  const [openMore, setOpenMore] = useState(null);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setDropdownsLoading(true);
        const [floorsRes, slotsRes] = await Promise.all([
          getFloors(),
          getSlots(),
        ]);

        setFloors(
          floorsRes.data.floors.map((f) => ({
            _id: f._id,
            label: `${f.name} (Floor ${f.number})`,
            raw: f,
          })),
        );

        setSlots(
          slotsRes.data.slots.map((s) => ({
            _id: s._id,
            label: `${s.name} · ${s.startTimeDisplay} - ${s.endTimeDisplay}`,
            raw: s,
          })),
        );
      } catch (error) {
        console.log(error.message);
      } finally {
        setDropdownsLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  const fetchGrid = useCallback(async () => {
    if (!selectedFloor || !selectedSlot) {
      setSeats([]);
      setSummary(null);
      return;
    }

    try {
      setGridLoading(true);
      setGridError("");

      const res = await getSeatGrid(selectedFloor, {
        slot: selectedSlot,
        date: selectedDate,
      });

      const { seats, summary, floor, slot } = res.data?.data || res.data || {};

      setSeats(seats || []);
      setSummary(summary || null);
      setGridFloor(floor || null);
      setGridSlot(slot || null);
    } catch (err) {
      setGridError(
        err.response?.data?.message || "Failed to load seat grid. Try again.",
      );
    } finally {
      setGridLoading(false);
    }
  }, [selectedFloor, selectedSlot, selectedDate]);

  useEffect(() => {
    fetchGrid();
  }, [fetchGrid]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setIsDrawerOpen(true);
  };

  const handleMutationSuccess = () => {
    fetchGrid();
  };

  const todayString = getTodayLocal();

  const bothSelected = selectedFloor && selectedSlot;

  return (
    <div className="font-['DM_Sans']">
      <div className="bg-slate-900 px-4 lg:px-6 pt-6 pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white font-['Playfair_Display']">
              Floors & Seats
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your library layout and see real-time seat availability
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsAddFloor(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Floor</span>
            </button>

            <button
              onClick={() => setIsAddSeat(true)}
              disabled={!selectedFloor}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl
               bg-amber-500 hover:bg-amber-600 text-slate-900
                font-semibold text-sm transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Add Seat</span>
            </button>
          </div>
        </div>
      </div>
      <div className=" px-4 lg:px-6 -mt-10 pb-10 space-y-4">
        <div className=" bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
          <div className=" flex flex-wrap gap-3">
            <FilterSelect
              label="Floor"
              value={selectedFloor}
              onChange={(val) => {
                setSelectedFloor(val);
                setSeats([]);
                setSummary(null);
              }}
              options={floors}
              placeholder={dropdownsLoading ? "Loading..." : "Select floor"}
              disabled={dropdownsLoading}
            />
            <FilterSelect
              label="Time Slot"
              value={selectedSlot}
              onChange={setSelectedSlot}
              options={slots}
              placeholder={dropdownsLoading ? "Loading..." : "Select slot"}
              disabled={dropdownsLoading}
            />
            <div className="flex-1 min-w-[160px]">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={todayString}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm
                  text-slate-900 dark:text-white
                  bg-white dark:bg-slate-800
                  border-slate-200 dark:border-slate-700
                  focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                  outline-none transition-all"
              />
            </div>
          </div>

          {!bothSelected && !dropdownsLoading && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
              Select a floor and time slot to see real-time seat availability
            </p>
          )}

          {bothSelected && !gridLoading && <SummaryBar summary={summary} />}
        </div>

        {bothSelected && (
          <div className="flex flex-wrap gap-3 px-1">
            {[
              { color: "bg-emerald-400", label: "Available" },
              { color: "bg-red-400", label: "Booked" },
              { color: "bg-orange-400", label: "Expiring soon (<= 7 days)" },
              { color: "bg-yellow-400", label: "Maintenance / Reserved" },
              { color: "bg-slate-300 dark:bg-slate-600", label: "Disabled" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <SeatGrid
          seats={seats}
          loading={gridLoading}
          error={gridError}
          bothSelected={bothSelected}
          onSeatClick={handleSeatClick}
        />
      </div>

      <div className="fixed bottom-5 right-5 z-50">
        <div
          className={`
            absolute bottom-14 right-0 max-h-[70vh] overflow-y-auto
            rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white
            border border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-sm
            p-5 transition-all duration-300 ease-in-out origin-bottom-right
            ${
              open
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 translate-y-2 pointer-events-none"
            }
          `}
        >
          {floors.map((floor, ind) => (
            <div key={floor._id} className="flex justify-between mb-5">
              <div>{floor.label}</div>
              <div className="relative">
                <div
                  className={`absolute bottom-5 right-4 ${openMore === ind ? "block" : "hidden"} border-5`}
                >
                  <span className="mx-3 text-blue-500">Update</span>
                  <span className="">Delete</span>
                </div>
                <button
                  onClick={() => {
                    if (ind === openMore) {
                      setOpenMore(null);
                      return;
                    }
                    setOpenMore(ind);
                  }}
                  className="cursor-pointer"
                >
                  <EllipsisVertical />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg bg-slate-800 dark:bg-white text-white dark:text-slate-800 cursor-pointer p-2 shadow-lg"
        >
          <CircleFadingPlus size={30} />
        </button>
      </div>

      {isDrawerOpen && selectedSeat && (
        <SeatDrawer
          seat={selectedSeat}
          floorId={selectedFloor}
          slotId={selectedSlot}
          floor={floors.filter((floor) => floor._id === selectedFloor)}
          slot={slots.filter((slot) => slot._id === selectedSlot)}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedSeat(null);
          }}
          onSuccess={handleMutationSuccess}
        />
      )}
      {isAddFloor && (
        <AddFloorModal
          onClose={() => setIsAddFloor(false)}
          onSuccess={() => {
            setIsAddFloor(false);
            getFloors().then((res) => {
              setFloors(
                res.data.floors.map((f) => ({
                  _id: f._id,
                  label: `${f.name} (Floor ${f.number})`,
                  raw: f,
                })),
              );
            });
          }}
        />
      )}
      {isAddSeat && (
        <AddSeatModal
          floorId={selectedFloor}
          onClose={() => setIsAddSeat(false)}
          onSuccess={() => {
            setIsAddSeat(false);
            handleMutationSuccess();
          }}
        />
      )}
    </div>
  );
};

export default FloorsPage;
