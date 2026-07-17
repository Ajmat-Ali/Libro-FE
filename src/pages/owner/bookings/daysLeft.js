function daysLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / 86400000);
}

export default daysLeft;
