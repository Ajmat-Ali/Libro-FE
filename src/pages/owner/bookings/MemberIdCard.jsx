import { useRef, useState } from "react";
import { Download, Printer, Loader2 } from "lucide-react";
// import QRPlaceholder from "./QRPlaceholder";
import Tag from "./Tag";
import MemberIdCardHeader from "./MemberIdCardHeader";
import MemberIdCardBody from "./MemberIdCardBody";

const STATUS_MAP = {
  active: {
    label: "ACTIVE MEMBER",
    dot: "#22c55e",
    bg: "#dcfce7",
    text: "#15803d",
  },
  expired: { label: "EXPIRED", dot: "#94a3b8", bg: "#f1f5f9", text: "#475569" },
  cancelled: {
    label: "CANCELLED",
    dot: "#ef4444",
    bg: "#fee2e2",
    text: "#dc2626",
  },
  rejected: {
    label: "REJECTED",
    dot: "#f43f5e",
    bg: "#ffe4e6",
    text: "#be123c",
  },
  pending: { label: "PENDING", dot: "#f59e0b", bg: "#fef3c7", text: "#92400e" },
};

export default function MemberIDCard({
  booking,
  membershipId,
  studentPhoto,
  qrDataUrl,
  libraryName = "Libro Library",
}) {
  const cardRef = useRef(null);
  const [dlLoading, setDlLoading] = useState(false);
  const [prtLoading, setPrtLoading] = useState(false);

  const [prt, setPrt] = useState(false);
  const [dl, setDl] = useState(false);

  // Derived
  const student = booking?.studentId ?? {};
  const seat = booking?.seatId ?? {};
  const slot = booking?.timeSlotId ?? {};
  //   const statusCfg = STATUS_MAP[booking?.status] ?? STATUS_MAP.expired;
  const fullName =
    `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || "Member";
  const initials =
    `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase() ||
    "M";

  const statusCfg = STATUS_MAP[booking?.status] ?? STATUS_MAP.expired;

  // ── html2canvas capture (dynamic import — only loads when needed) ──

  const captureCard = async () => {
    if (!cardRef.current) throw new Error("Card ref missing");
    const html2canvas = (await import("html2canvas")).default;

    return html2canvas(cardRef.current, {
      scale: 3, // 3× = print-quality (1200×744 px output)
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  };

  const captureCards = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const el = cardRef.current;

    // Temporarily disable clipping during capture
    const prevOverflow = el.style.overflow;
    const prevRadius = el.style.borderRadius;
    el.style.overflow = "visible";
    el.style.borderRadius = "0";

    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
    });

    // Restore
    el.style.overflow = prevOverflow;
    el.style.borderRadius = prevRadius;

    return canvas;
  };

  // ------------------- Download PNG ----------------------------------

  // const handleDownload = async () => {
  //   if (dlLoading) return;
  //   setDlLoading(true);
  //   try {
  //     const canvas = await captureCard();
  //     const link = document.createElement("a");
  //     link.download = `${fullName.replace(/\s+/g, "-").toLowerCase()}-library-card.png`;
  //     link.href = canvas.toDataURL("image/png", 1.0);
  //     link.click();
  //   } catch (err) {
  //     console.error("Download failed:", err);
  //   } finally {
  //     setDlLoading(false);
  //   }
  // };

  // ── Print ────────────────────────────────────────────────────────
  // const handlePrints = async () => {
  //   if (prtLoading) return;
  //   setPrtLoading(true);
  //   try {
  //     const canvas = await captureCard();
  //     const dataUrl = canvas.toDataURL("image/png", 1.0);

  //     const win = window.open("", "_blank", "width=640,height=480");
  //     win.document.write(`<!DOCTYPE html>
  // <html>
  // <head>
  //   <title>Library ID Card — ${fullName}</title>
  //   <style>
  //     * { margin: 0; padding: 0; box-sizing: border-box; }
  //     body {
  //       min-height: 100vh;
  //       display: flex;
  //       flex-direction: column;
  //       align-items: center;
  //       justify-content: center;
  //       background: #f8fafc;
  //       padding: 24px;
  //       gap: 20px;
  //       font-family: system-ui, sans-serif;
  //     }
  //     img {
  //       max-width: 400px;
  //       width: 100%;
  //       border-radius: 14px;
  //       box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  //     }
  //     p {
  //       font-size: 12px;
  //       color: #94a3b8;
  //     }
  //     @media print {
  //       body { background: white; padding: 0; justify-content: flex-start; padding-top: 20px; }
  //       img  { max-width: 340px; box-shadow: none; }
  //       p    { display: none; }
  //     }
  //   </style>
  // </head>
  // <body>
  //   <img src="${dataUrl}" alt="Library ID Card" />
  //   <p>${libraryName} · ${fullName} · ${membershipId ?? ""}</p>
  //   <script>
  //     window.onload = () => setTimeout(() => { window.print(); }, 400);
  //   </script>
  // </body>
  // </html>`);
  //     win.document.close();
  //   } catch (err) {
  //     console.error("Print failed:", err);
  //   } finally {
  //     setPrtLoading(false);
  //   }
  // };

  const handleDownload = async () => {
    if (dlLoading) return;
    setDlLoading(true);
    setDl(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });
      const a = document.createElement("a");
      a.download = `${fullName.replace(/\s+/g, "-").toLowerCase()}-id-card.png`;
      a.href = dataUrl;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDl(false);
      setDlLoading(false);
    }
  };

  const handlePrint = async () => {
    if (prtLoading) return;
    setPrtLoading(true);
    setPrt(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });
      const win = window.open("", "_blank", "width=640,height=500");
      win.document.write(`<!DOCTYPE html><html><head><title>ID Card</title>
    <style>
      body { display:flex; justify-content:center; padding:32px; background:#f1f5f9; }
      img  { max-width:420px; border-radius:14px; box-shadow:0 20px 60px rgba(0,0,0,.15); }
      @media print { body{background:white;padding:0} img{box-shadow:none} }
    </style></head>
    <body><img src="${dataUrl}"/><script>window.onload=()=>setTimeout(()=>window.print(),350)</script>
    </body></html>`);
      win.document.close();
    } catch (e) {
      console.error(e);
    } finally {
      setPrt(false);
      setPrtLoading(false);
    }
  };

  return (
    <div>
      <p
        style={{
          fontSize: "19px",
          fontWeight: 600,
          color: "#94a3b8",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        Membership ID Card
      </p>

      {/* ── The Card ────────────────────────── ref here ─ */}
      <div
        ref={cardRef}
        style={{
          width: "400px",
          height: "248px",
          borderRadius: "16px",
          overflow: "hidden",
          fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
          background: "#ffffff",
          position: "relative",
          flexShrink: 0,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <MemberIdCardHeader libraryName={libraryName} />

        {/* ════ CARD BODY ══════════════════════════════ */}
        <MemberIdCardBody
          statusCfg={statusCfg}
          membershipId={membershipId}
          booking={booking}
          qrDataUrl={qrDataUrl}
        />

        {/* ════ BOTTOM ACCENT STRIP ════════════════════ */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3.5px",
            background:
              "linear-gradient(90deg, #f59e0b 0%, #ea580c 50%, #f59e0b 100%)",
          }}
        />
      </div>

      {/* ── Action Buttons (outside card = NOT captured) ─────── */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "14px",
        }}
      >
        <button
          onClick={handleDownload}
          disabled={dlLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-amber-200 dark:shadow-none"
        >
          {dlLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download PNG
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          disabled={prtLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl transition-all shadow-sm"
        >
          {prtLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Preparing…
            </>
          ) : (
            <>
              <Printer className="w-4 h-4" /> Print Card
            </>
          )}
        </button>
      </div>
    </div>
  );
}
