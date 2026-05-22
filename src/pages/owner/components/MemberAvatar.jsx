const Avatar = ({ firstName, lastName, photo }) => {
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";

  if (photo) {
    return (
      <img
        src={photo}
        alt={initials}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
      <span className="text-slate-900 text-xs font-bold">{initials}</span>
    </div>
  );
};
export default Avatar;
