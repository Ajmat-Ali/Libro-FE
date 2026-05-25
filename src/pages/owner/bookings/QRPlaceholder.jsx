function QRPlaceholder() {
  // Simple grid of squares mimicking a QR pattern
  const cells = Array(49).fill(null);
  const darkCells = new Set([
    0,
    1,
    2,
    3,
    4,
    5,
    6, // top-left finder rows
    7,
    13,
    14,
    20,
    21,
    27,
    42,
    43,
    44,
    45,
    46,
    47,
    48, // bottom-left finder
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    6,
    13,
    20,
    27,
    34,
    41,
    48, // right edges of finders
    24,
    25,
    26, // center timing
  ]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "1px",
        padding: "2px",
        opacity: 0.25,
      }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          style={{
            background: darkCells.has(i) ? "#1e293b" : "transparent",
            borderRadius: "1px",
          }}
        />
      ))}
    </div>
  );
}

export default QRPlaceholder;
