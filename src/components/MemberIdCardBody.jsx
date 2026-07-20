import React from "react";
import QRPlaceholder from "./QRPlaceholder";
import Tag from "./Tag";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const MemberIdCardBody = ({
  studentPhoto,
  statusCfg,
  membershipId,
  booking,
  qrDataUrl,
  libraryName = "Libro Library",
}) => {
  const student = booking?.studentId ?? {};
  const seat = booking?.seatId ?? {};
  const slot = booking?.timeSlotId ?? {};
  //   const statusCfg = STATUS_MAP[booking?.status] ?? STATUS_MAP.expired;
  const fullName =
    `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || "Member";
  const initials =
    `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase() ||
    "M";

  return (
    <div
      style={{
        padding: "14px 18px 12px",
        display: "flex",
        gap: "14px",
        height: "calc(248px - 54px)", // total height - header height
        // minHeight: "194px",
        position: "relative",
        // boxSizing: "border-box",
      }}
    >
      {/* ── LEFT: Photo + Status ──────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
          width: "76px",
        }}
      >
        {/* Photo / Initials */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #f59e0b",
            background: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: 800,
            color: "#d97706",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(245,158,11,0.25)",
          }}
        >
          {studentPhoto ? (
            <img
              src={studentPhoto}
              alt={fullName}
              crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            initials
          )}
        </div>

        {/* Status Badge */}
        <div
          style={{
            background: statusCfg.bg,
            border: `1px solid ${statusCfg.dot}44`,
            borderRadius: "999px",
            padding: "2px 7px",
            display: "flex",
            alignItems: "center",
            gap: "3px",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: statusCfg.dot,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "8px",
              fontWeight: 700,
              color: statusCfg.text,
              letterSpacing: "0.4px",
            }}
          >
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* ── MIDDLE: Details ───────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        {/* Name + Membership ID */}
        <div>
          <div
            style={{
              fontSize: "17px",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.4px",
              lineHeight: 1.15,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fullName}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#f59e0b",
              fontWeight: 700,
              marginTop: "3px",
              letterSpacing: "0.8px",
            }}
          >
            {membershipId ?? "PENDING APPROVAL"}
          </div>
        </div>

        {/* Thin amber divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, #fde68a, #fed7aa33, transparent)",
            margin: "6px 0",
          }}
        />

        {/* Details rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {/* Seat */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Tag
              label="SEAT"
              value={seat.seatLabel ?? "—"}
              extra={seat.seatType ? `· ${seat.seatType}` : ""}
            />
          </div>

          {/* Slot */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Tag
              label="SLOT"
              value={slot.name ?? "—"}
              extra={
                slot.startTimeDisplay
                  ? `${slot.startTimeDisplay}–${slot.endTimeDisplay}`
                  : ""
              }
            />
          </div>

          {/* Valid dates */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Tag
              label="VALID"
              value={`${fmtDate(booking?.startDate)} – ${fmtDate(booking?.endDate)}`}
              extra=""
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: QR Code ────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "5px",
          flexShrink: 0,
          paddingTop: "2px",
        }}
      >
        {/* QR box */}
        <div
          style={{
            width: "76px",
            height: "76px",
            background: "#f8fafc",
            border: "2px solid #e2e8f0",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            /* Placeholder when QR not loaded yet */
            <QRPlaceholder />
          )}
        </div>

        {/* Scan label */}
        <div
          style={{
            fontSize: "8px",
            color: "#94a3b8",
            textAlign: "center",
            lineHeight: 1.3,
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          SCAN TO
          <br />
          VERIFY
        </div>
      </div>

      {/* ── BOTTOM-LEFT: Tiny watermark text ─────── */}
      {/* <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "108px", // aligns under middle column
          fontSize: "8px",
          color: "#cbd5e1",
          fontWeight: 500,
          letterSpacing: "0.3px",
        }}
        className="border-3"
      >
        {libraryName} · Verified Member
      </div> */}
    </div>
  );
};

export default MemberIdCardBody;
