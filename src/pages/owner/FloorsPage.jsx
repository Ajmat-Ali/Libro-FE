import React, { useEffect, useState } from "react";
import SeatCard from "./floor_seat/SeatCard";
import SeatGrid from "./floor_seat/SeatGrid";
import { getSeatsGrid } from "../../api/owner.api";
import { SeatCardSkeleton } from "./floor_seat/SeatSkeloton";

const seats = [
  {
    seat: {
      _id: "6a2770ca80319af8fd61db6f",
      seatLabel: "A1",
      seatType: "general",
      status: "reserved",
    },
    gridStatus: "booked",
    dayLeft: 10,
  },
  {
    seat: {
      _id: "6a2770ca80319af8fd61db6f",
      seatLabel: "A2",
      seatType: "general",
      status: "reserved",
    },
    gridStatus: "availabe",
    dayLeft: 20,
  },
  {
    seat: {
      _id: "6a2770ca80319af8fd61db6f",
      seatLabel: "A3",
      seatType: "general",
      status: "reserved",
    },
    gridStatus: "expiring_soon",
    dayLeft: 3,
  },
];

const FloorsPage = () => {
  const [selectedFloor, setSelectedFloor] = useState(
    "6a27706d80319af8fd61db6d",
  );
  const [selectedSlot, setSelectedSlot] = useState("6a27715680319af8fd61db78");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [allSeats, setAllSeats] = useState([]);

  const [floors, setFloors] = useState([]);
  const [queryDate, setqueryDate] = useState(null);
  // const [seats, setSeats] = useState([]);
  const [summary, setSummary] = useState(null);

  const getSeats = async () => {
    try {
      setLoading(true);

      const response = await getSeatsGrid(
        selectedFloor,
        selectedSlot,
        selectedDate,
      );
      // console.log(response.data.data);
      const data = response?.data?.data;
      setFloors(data?.floor);
      setAllSeats(data?.seats);
      setSummary(data?.summary);
      setqueryDate(data?.queryDate);

      setLoading(false);
      setServerError("");
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedFloor && selectedSlot) {
      getSeats();
    }
  }, [selectedFloor, selectedSlot, selectedDate]);

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  if (!allSeats || allSeats.length === 0) {
    return <SeatGrid />;
  }
  // console.log(allSeats);

  return (
    <div className="mx-7 my-10">
      {!loading ? (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-7">
          {[...Array(40)].map((e, _in) => {
            return <SeatCardSkeleton key={_in} />;
          })}
        </div>
      ) : (
        <div className="m-10 flex gap-x-5 gap-y-7 flex-wrap justify-center border-4-">
          {allSeats.map((seat) => {
            return (
              <div key={seat.seat._id} className="">
                <SeatCard
                  key={Math.random()}
                  seatData={{
                    seat: seat.seat,
                    gridStatus: seat.gridStatus,
                    dayLeft: seat.dayLeft,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FloorsPage;
