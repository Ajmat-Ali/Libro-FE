export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateShort = (isoString) => {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

// export const formatDate = (isoString) => {
//   return new Date(isoString).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// };

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
