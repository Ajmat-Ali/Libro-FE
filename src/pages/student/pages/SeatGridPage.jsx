import { LayoutGrid, Plus } from "lucide-react";

import PlaceholderPage from "../components/PlaceholderPage";
import FilterSelect from "../../../shared/FilterSelect";
import SeatGrid from "../../../shared/SeatGrid";
import { useCallback, useEffect, useState } from "react";
import {
  getStudentFloors,
  getStudentSeatGrid,
  getStudentSlots,
} from "../../../api/student.api";
import SummaryBar from "../../../shared/SummaryBar";
import BookSeatModal from "../components/BookSeatModal";

const getTodayLocal = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const SeatGridPage = () => {
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());

  const [floors, setFloors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [seats, setSeats] = useState([]);

  const [gridFloor, setGridFloor] = useState(null);
  const [gridSlot, setGridSlot] = useState(null);
  const [summary, setSummary] = useState(null);

  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [gridLoading, setGridLoading] = useState(false);
  const [gridError, setGridError] = useState("");

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const todayString = getTodayLocal();

  const bothSelected = selectedFloor && selectedSlot;

  const fetchDropdowns = async () => {
    try {
      setDropdownsLoading(true);
      const [floorsRes, slotsRes] = await Promise.all([
        getStudentFloors(),
        getStudentSlots(),
      ]);

      setFloors(
        floorsRes.floors.map((f) => ({
          _id: f._id,
          label: `${f.name} (Floor ${f.number})`,
          raw: f,
        })),
      );

      setSlots(
        slotsRes.slots.map((s) => ({
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

  useEffect(() => {
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

      const res = await getStudentSeatGrid(selectedFloor, {
        slotId: selectedSlot,
        date: selectedDate,
      });

      const { seats, summary, floor, slot } = res.data?.data || res.data || {};

      setSeats(seats || []);
      setSummary(summary || null);
      setGridFloor(floor || null);
      setGridSlot(slot || null);
    } catch (err) {
      console.log(err.response);
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

  return (
    <div className="">
      <div className="bg-slate-900 px-4 lg:px-6 pt-6 pb-16">
        <h1 className="text-xl font-bold text-white font-['Playfair_Display']">
          Book Your Seats
        </h1>
      </div>
      <div className="px-4 lg:px-6 -mt-10 pb-10 space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
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

        {"bothSelected" && (
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

      {isDrawerOpen && (
        <BookSeatModal
          seat={selectedSeat}
          slot={slots.filter((s) => s._id === selectedSlot)}
          floor={floors.filter((f) => f._id === selectedFloor)}
          selectedDate={selectedDate}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedSeat(null);
          }}
        />
      )}
    </div>
  );
};

export default SeatGridPage;
