import React from "react";

const MemberIdCardHeader = ({ libraryName, name }) => {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #f59e0b 0%, #ea580c 60%, #dc2626 100%)",
        padding: "11px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -14,
          right: 60,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -8,
          right: 30,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 8,
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.25)",
        }}
      />

      {/* Library name */}
      <div>
        <div
          style={{
            color: "white",
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "0.3px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {/* Book icon (inline SVG) */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          {libraryName.toUpperCase()}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.78)",
            fontSize: "9px",
            marginTop: "2px",
            letterSpacing: "2.5px",
            fontWeight: 600,
          }}
        >
          LIBRARY MEMBERSHIP CARD
        </div>
      </div>

      {/* Stacked circles (right side decoration) */}
      <div style={{ display: "flex", gap: "5px", opacity: 0.35 }}>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
          }}
        />
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            border: "2.5px solid rgba(255,255,255,0.7)",
          }}
        />
      </div>
    </div>
  );
};

export default MemberIdCardHeader;
