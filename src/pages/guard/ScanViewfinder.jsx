// // src/pages/guard/components/ScanViewfinder.jsx
// // Responsibility: Renders the QR camera scanner with animated UI overlay.
// // Uses html5-qrcode library. Calls onScanSuccess when a QR is detected.

// import { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { CameraOff, RefreshCw } from "lucide-react";

// const SCANNER_ID = "qr-scanner-container";

// export default function ScanViewfinder({ onScanSuccess, paused }) {
//   const scannerRef = useRef(null);
//   const [error, setError] = useState(null);
//   const [starting, setStarting] = useState(true);

//   // ── Start scanner ────────────────────────────────────────────────
//   const startScanner = async () => {
//     setError(null);
//     setStarting(true);

//     try {
//       const cameras = await Html5Qrcode.getCameras();
//       if (!cameras || cameras.length === 0) {
//         setError("No camera found on this device");
//         setStarting(false);
//         return;
//       }

//       // Prefer back camera on phones (better for scanning)
//       const camera =
//         cameras.find(
//           (c) =>
//             c.label.toLowerCase().includes("back") ||
//             c.label.toLowerCase().includes("rear") ||
//             c.label.toLowerCase().includes("environment"),
//         ) ?? cameras[cameras.length - 1];

//       const html5Qr = new Html5Qrcode(SCANNER_ID, { verbose: false });
//       scannerRef.current = html5Qr;

//       await html5Qr.start(
//         camera.id,
//         {
//           fps: 15,
//           qrbox: { width: 220, height: 220 },
//           aspectRatio: 1.0,
//           disableFlip: false,
//         },
//         (decodedText) => {
//           // Called on every successful decode
//           // We only act when not paused (result being shown)
//           if (!paused) onScanSuccess(decodedText);
//         },
//         () => {}, // suppress per-frame errors (normal when no QR in frame)
//       );

//       setStarting(false);
//     } catch (err) {
//       const msg = err?.message ?? String(err);
//       if (msg.toLowerCase().includes("permission")) {
//         setError("Camera permission denied. Please allow camera access.");
//       } else {
//         setError("Could not start camera. Try refreshing the page.");
//       }
//       setStarting(false);
//     }
//   };

//   const stopScanner = async () => {
//     if (scannerRef.current) {
//       try {
//         if (scannerRef.current.isScanning) {
//           await scannerRef.current.stop();
//         }
//         scannerRef.current.clear();
//       } catch {}
//       scannerRef.current = null;
//     }
//   };

//   useEffect(() => {
//     startScanner();
//     return () => {
//       stopScanner();
//     };
//   }, []);

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-6">
//         <div className="w-16 h-16 rounded-full bg-red-900/40 flex items-center justify-center">
//           <CameraOff className="w-8 h-8 text-red-400" />
//         </div>
//         <div className="text-center">
//           <p className="text-white font-semibold">{error}</p>
//           <p className="text-slate-400 text-sm mt-1">
//             Make sure you allow camera access in your browser
//           </p>
//         </div>
//         <button
//           onClick={startScanner}
//           className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
//         >
//           <RefreshCw className="w-4 h-4" /> Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
//       <div
//         id={SCANNER_ID}
//         className="w-full h-full"
//         style={{ "& video": { objectFit: "cover" } }}
//       />

//       {/* ── Starting overlay ── */}
//       {starting && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 gap-3 z-10">
//           <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
//           <p className="text-slate-400 text-sm">Starting camera…</p>
//         </div>
//       )}

//       {!starting && (
//         <div
//           className="absolute inset-0 pointer-events-none z-10 "
//           style={{
//             background:
//               "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
//           }}
//         />
//       )}

//       {/* ── Scan frame with animated corners ── */}
//       {!starting && (
//         <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
//           <div className="relative w-56 h-56">
//             {/* Animated scanning line */}
//             <div className="absolute inset-0 overflow-hidden rounded">
//               <div
//                 className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
//                 style={{ animation: "scanLine 2s ease-in-out infinite" }}
//               />
//             </div>

//             {/* Corner brackets — top-left */}
//             <div className="absolute top-0 left-0 w-8 h-8 ">
//               <div className="absolute top-0 left-0 w-8 h-0.5 bg-amber-400 rounded" />
//               <div className="absolute top-0 left-0 w-0.5 h-8 bg-amber-400 rounded" />
//             </div>
//             {/* top-right */}
//             <div className="absolute top-0 right-0 w-8 h-8">
//               <div className="absolute top-0 right-0 w-8 h-0.5 bg-amber-400 rounded" />
//               <div className="absolute top-0 right-0 w-0.5 h-8 bg-amber-400 rounded" />
//             </div>
//             {/* bottom-left */}
//             <div className="absolute bottom-0 left-0 w-8 h-8">
//               <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-400 rounded" />
//               <div className="absolute bottom-0 left-0 w-0.5 h-8 bg-amber-400 rounded" />
//             </div>
//             {/* bottom-right */}
//             <div className="absolute bottom-0 right-0 w-8 h-8">
//               <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-amber-400 rounded" />
//               <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-amber-400 rounded" />
//             </div>

//             {/* Pulsing outer ring */}
//             <div
//               className="absolute -inset-3 rounded border border-amber-400/30"
//               style={{ animation: "pulse 2s ease-in-out infinite" }}
//             />
//           </div>
//         </div>
//       )}

//       {/* ── Scan line keyframe (injected via style tag) ── */}
//       <style>{`
//         @keyframes scanLine {
//           0%   { top: 4px;   opacity: 0; }
//           10%  { opacity: 1; }
//           90%  { opacity: 1; }
//           100% { top: calc(100% - 4px); opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// }

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CameraOff, RefreshCw } from "lucide-react";

const SCANNER_ID = "qr-scanner-container";

export default function ScanViewfinder({ onScanSuccess, paused }) {
  const scannerRef = useRef(null);

  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(true);

  const startScanner = async () => {
    setError(null);
    setStarting(true);

    try {
      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        setError("No camera found on this device");
        setStarting(false);
        return;
      }

      const camera =
        cameras.find(
          (c) =>
            c.label.toLowerCase().includes("back") ||
            c.label.toLowerCase().includes("rear") ||
            c.label.toLowerCase().includes("environment"),
        ) ?? cameras[cameras.length - 1];

      const html5Qr = new Html5Qrcode(SCANNER_ID, {
        verbose: false,
      });

      scannerRef.current = html5Qr;

      await html5Qr.start(
        camera.id,
        {
          fps: 15,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        (decodedText) => {
          if (!paused) {
            onScanSuccess(decodedText);
          }
        },
        () => {},
      );

      setStarting(false);
    } catch (err) {
      const msg = err?.message ?? String(err);

      if (msg.toLowerCase().includes("permission")) {
        setError("Camera permission denied. Please allow camera access.");
      } else {
        setError("Could not start camera. Try refreshing the page.");
      }

      setStarting(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }

        await scannerRef.current.clear();
      } catch {}

      scannerRef.current = null;
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-6">
        <div className="w-16 h-16 rounded-full bg-red-900/40 flex items-center justify-center">
          <CameraOff className="w-8 h-8 text-red-400" />
        </div>

        <div className="text-center">
          <p className="text-white font-semibold">{error}</p>

          <p className="text-slate-400 text-sm mt-1">
            Make sure you allow camera access in your browser
          </p>
        </div>

        <button
          onClick={startScanner}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div id={SCANNER_ID} className="w-full h-full" />

      {starting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 gap-3 z-10">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />

          <p className="text-slate-400 text-sm">Starting camera…</p>
        </div>
      )}

      {!starting && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="relative w-56 h-56">
              <div className="absolute inset-0 overflow-hidden rounded">
                <div
                  className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                  style={{
                    animation: "scanLine 2s ease-in-out infinite",
                  }}
                />
              </div>

              {/* corners */}
              <div className="absolute top-0 left-0 w-8 h-8">
                <div className="absolute top-0 left-0 w-8 h-0.5 bg-amber-400 rounded" />
                <div className="absolute top-0 left-0 w-0.5 h-8 bg-amber-400 rounded" />
              </div>

              <div className="absolute top-0 right-0 w-8 h-8">
                <div className="absolute top-0 right-0 w-8 h-0.5 bg-amber-400 rounded" />
                <div className="absolute top-0 right-0 w-0.5 h-8 bg-amber-400 rounded" />
              </div>

              <div className="absolute bottom-0 left-0 w-8 h-8">
                <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-400 rounded" />
                <div className="absolute bottom-0 left-0 w-0.5 h-8 bg-amber-400 rounded" />
              </div>

              <div className="absolute bottom-0 right-0 w-8 h-8">
                <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-amber-400 rounded" />
                <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-amber-400 rounded" />
              </div>

              <div
                className="absolute -inset-3 rounded border border-amber-400/30"
                style={{
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes scanLine {
          0%   { top: 4px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: calc(100% - 4px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
