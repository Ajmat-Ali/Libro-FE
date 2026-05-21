// "06:00" → 360 (minutes from midnight)
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// 360 → "6:00 AM"
export const formatTimeDisplay = (totalMinutes) => {
  const mins = totalMinutes > 1439 ? totalMinutes - 1440 : totalMinutes;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period}`;
};
