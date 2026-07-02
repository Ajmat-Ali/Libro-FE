import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  LayoutGrid,
  CircleFadingPlus,
  EllipsisVertical,
} from "lucide-react";
import {
  getFloors,
  getSlots,
  getSeatGrid,
  updateFloor,
  deleteFloor,
} from "../../api/owner.api";
import SeatGrid from "./floor_seat/SeatGrid";
import AddFloorModal from "./floor_seat/AddFloorModel";
import AddSeatModal from "./floor_seat/AddSeatModel";
import SeatDrawer from "./floor_seat/SeatDrawer";
import FloorOperation from "./floor_seat/section/FloorOperation";
import FilterSelect from "./floor_seat/section/FilterSelect";
import SummaryBar from "./floor_seat/section/SummaryBar";

import Toast from "./floor_seat/section/Toast";

const getTodayLocal = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

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

  const [updating, setUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ type: "", message: "" });

  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteFloor = async (id) => {
    try {
      setDeleting(true);
      await deleteFloor(id);

      setShowToast(true);
      setToastData({ type: "success", message: "Floor deleted successfully." });
      setDeleting(false);
      fetchDropdowns();
    } catch (error) {
      setDeleting(false);
      setShowToast(true);
      setToastData({
        type: "fail",
        message:
          error?.response?.data?.message ||
          "Something went wrong while updating the floor.",
      });
    } finally {
      setTimeout(() => {
        setShowToast(false);
        setToastData({
          type: "",
          message: "",
        });
      }, 3000);
    }
  };

  const handleUpdateFloorSave = async (floorData) => {
    try {
      setUpdating(true);
      await updateFloor(floorData);
      setShowToast(true);
      setToastData({ type: "success", message: "Floor updated successfully." });

      setUpdating(false);
      fetchDropdowns();
    } catch (error) {
      setUpdating(false);
      setShowToast(true);
      setToastData({
        type: "success",
        message:
          error?.response?.data?.message ||
          "Something went wrong while updating the floor.",
      });
    } finally {
      setTimeout(() => {
        setShowToast(false);
        setToastData({
          type: "",
          message: "",
        });
      }, 3000);
    }
  };

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

      <FloorOperation
        floors={floors}
        handleDeleteFloor={handleDeleteFloor}
        handleUpdateFloorSave={handleUpdateFloorSave}
        updating={updating}
      />
      {showToast && toastData?.type && <Toast toastData={toastData} />}

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
