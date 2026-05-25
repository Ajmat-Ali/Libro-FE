function Tag({ label, value, extra }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexWrap: "nowrap",
      }}
    >
      <div
        style={{
          background: "#fef3c7",
          border: "1px solid #fde68a",
          borderRadius: "4px",
          padding: "1px 6px",
          fontSize: "9px",
          fontWeight: 700,
          color: "#92400e",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#1e293b",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
      {extra && (
        <span
          style={{
            fontSize: "9px",
            color: "#94a3b8",
            whiteSpace: "nowrap",
          }}
        >
          {extra}
        </span>
      )}
    </div>
  );
}

export default Tag;
