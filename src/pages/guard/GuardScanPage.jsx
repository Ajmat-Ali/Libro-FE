// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { LogOut, Wifi, WifiOff, BookOpen } from "lucide-react";
// import { clearCredentials } from "../../store/slices/authSlice";
// import { scanQR } from "../../api/guard.api";
// import ScanViewfinder from "./ScanViewfinder";
// import ScanResult from "./ScanResult";
// import { logoutUser } from "../../api/auth.api";

// // ── LIVE CLOCK ────────────────────────────────────────────────────
// function useClock() {
//   const [time, setTime] = useState(new Date());
//   useEffect(() => {
//     const id = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(id);
//   }, []);
//   return time;
// }

// // ── ONLINE STATUS ─────────────────────────────────────────────────
// function useOnline() {
//   const [online, setOnline] = useState(navigator.onLine);
//   useEffect(() => {
//     const on = () => setOnline(true);
//     const off = () => setOnline(false);
//     window.addEventListener("online", on);
//     window.addEventListener("offline", off);
//     return () => {
//       window.removeEventListener("online", on);
//       window.removeEventListener("offline", off);
//     };
//   }, []);
//   return online;
// }

// // ── SCAN STATES ───────────────────────────────────────────────────
// // "idle"       → camera running, waiting for QR
// // "loading"    → QR detected, API call in progress
// // "success"    → valid scan, showing student info
// // "failure"    → invalid scan, showing error

// export default function GuardScanPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((s) => s.auth?.user);
//   const time = useClock();
//   const online = useOnline();

//   const [scanState, setScanState] = useState("idle"); // idle | loading | success | failure
//   const [result, setResult] = useState(null); // { type, data? failReason? }
//   const [countdown, setCountdown] = useState(0);
//   const countdownRef = useRef(null);

//   // Prevent duplicate scans while one is in progress
//   const processingRef = useRef(false);

//   const [started, setStarted] = useState(false);

//   // ── Auto-reset countdown after result ────────────────────────────
//   const startCountdown = useCallback((seconds) => {
//     setCountdown(seconds);
//     if (countdownRef.current) clearInterval(countdownRef.current);

//     countdownRef.current = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdownRef.current);
//           handleReset();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }, []);

//   const handleReset = useCallback(() => {
//     if (countdownRef.current) clearInterval(countdownRef.current);
//     setScanState("idle");
//     setResult(null);
//     setCountdown(0);
//     processingRef.current = false;
//   }, []);

//   // cleanup on unmount
//   useEffect(
//     () => () => {
//       if (countdownRef.current) clearInterval(countdownRef.current);
//     },
//     [],
//   );

//   // ── Handle QR decode ─────────────────────────────────────────────
//   const handleScan = useCallback(
//     async (token) => {
//       // Ignore if already processing or not in idle state
//       if (processingRef.current || scanState !== "idle") return;
//       processingRef.current = true;
//       setScanState("loading");

//       try {
//         const res = await scanQR(token);
//         const data = res.data;

//         setResult({ type: "success", data });
//         setScanState("success");
//         startCountdown(400);
//       } catch (err) {
//         const failReason =
//           err.response?.data?.failReason ??
//           err.response?.data?.reason ??
//           "invalid_token";

//         setResult({ type: "failure", failReason });
//         setScanState("failure");
//         startCountdown(400);
//       }
//     },
//     [scanState, startCountdown],
//   );

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//     } catch (error) {
//     } finally {
//       dispatch(clearCredentials());
//       navigate("/login", { replace: true });
//     }
//   };

//   const timeStr = time.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
//   const dateStr = time.toLocaleDateString("en-IN", {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//   });

//   // ── RENDER ────────────────────────────────────────────────────────
//   return (
//     <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
//       <div className="relative z-20 flex items-center justify-between px-5 py-3 bg-slate-950/90 backdrop-blur-sm border-b border-white/5">
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
//             <BookOpen className="w-4 h-4 text-amber-400" />
//           </div>
//           <div>
//             <p className="text-white text-sm font-bold leading-tight">Libro</p>
//             <p className="text-slate-500 text-xs leading-tight">Guard Panel</p>
//           </div>
//         </div>

//         <div className="absolute left-1/2 -translate-x-1/2 text-center">
//           <p className="text-white font-bold text-base tabular-nums leading-tight">
//             {timeStr}
//           </p>
//           <p className="text-slate-500 text-xs leading-tight">{dateStr} </p>
//         </div>

//         {/* Right: Online + guard name + logout */}
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-1.5">
//             {online ? (
//               <Wifi className="w-3.5 h-3.5 text-emerald-400" />
//             ) : (
//               <WifiOff className="w-3.5 h-3.5 text-red-400" />
//             )}
//             <span
//               className={`text-xs font-medium ${online ? "text-emerald-400" : "text-red-400"}`}
//             >
//               {online ? "Online" : "Offline"}
//             </span>
//           </div>

//           {user && (
//             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
//               <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
//                 {user.firstName?.[0]?.toUpperCase() ?? "G"}
//               </div>
//               <span className="text-white text-xs font-medium">
//                 {user.firstName[0].toUpperCase() + user.firstName.slice(1)}
//               </span>
//             </div>
//           )}

//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors"
//             title="Logout"
//           >
//             <LogOut className="w-3.5 h-3.5" />
//             <span className="hidden sm:inline">Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* ══ MAIN AREA ══════════════════════════════════════════════ */}
//       <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
//         <div
//           className="relative overflow-hidden"
//           style={{
//             width: "min(100vw, 480px)",
//             height: "min(100vw, 480px)",
//           }}
//         >
//           <ScanViewfinder
//             onScanSuccess={handleScan}
//             paused={scanState !== "idle"}
//           />

//           {scanState === "loading" && (
//             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm gap-3">
//               <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
//               <p className="text-white text-sm font-medium">Verifying QR…</p>
//             </div>
//           )}

//           {(scanState === "success" || scanState === "failure") && result && (
//             <ScanResult
//               result={result}
//               countdown={countdown}
//               onReset={handleReset}
//             />
//           )}
//         </div>

//         {scanState === "idle" && (
//           <div className="mt-6 text-center px-6 pointer-events-none">
//             <p className="text-white text-base font-semibold">
//               Point camera at QR code
//             </p>
//             <p className="text-slate-500 text-sm mt-1">
//               Hold steady — scanning automatically
//             </p>
//           </div>
//         )}

//         {!online && (
//           <div className="absolute bottom-0 left-0 right-0 bg-red-600 px-4 py-2.5 flex items-center justify-center gap-2 z-30">
//             <WifiOff className="w-4 h-4 text-white" />
//             <p className="text-white text-sm font-semibold">
//               No internet — scans won't be verified until reconnected
//             </p>
//           </div>
//         )}
//       </div>

//       <div className="relative z-20 px-5 py-3 bg-slate-950/90 backdrop-blur-sm border-t border-white/5">
//         <div className="flex items-center justify-between max-w-[480px] mx-auto">
//           <div className="flex items-center gap-2">
//             <div
//               className={`w-2 h-2 rounded-full  ${
//                 scanState === "idle"
//                   ? "bg-amber-400 animate-pulse"
//                   : scanState === "loading"
//                     ? "bg-blue-400 animate-pulse"
//                     : scanState === "success"
//                       ? "bg-emerald-400"
//                       : "bg-red-400"
//               }`}
//             />
//             <span className="text-slate-400 text-xs">
//               {scanState === "idle" && "Ready to scan"}
//               {scanState === "loading" && "Verifying…"}
//               {scanState === "success" && "Scan successful"}
//               {scanState === "failure" && "Scan failed"}
//             </span>
//           </div>

//           <span className="text-slate-600 text-xs">
//             {new Date().toLocaleDateString("en-IN", {
//               day: "numeric",
//               month: "long",
//             })}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Wifi, WifiOff, BookOpen, Camera } from "lucide-react";

import { clearCredentials } from "../../store/slices/authSlice";
import { scanQR } from "../../api/guard.api";
import ScanViewfinder from "./ScanViewfinder";
import ScanResult from "./ScanResult";
import { logoutUser } from "../../api/auth.api";

// ── LIVE CLOCK ────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

// ── ONLINE STATUS ─────────────────────────────────────────────────
function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);

    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return online;
}

export default function GuardScanPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth?.user);

  const time = useClock();
  const online = useOnline();

  const [scanState, setScanState] = useState("idle");
  const [result, setResult] = useState(null);

  // scanner visibility
  const [scannerActive, setScannerActive] = useState(false);

  // Prevent duplicate scans
  const processingRef = useRef(false);

  // ── Handle QR decode ─────────────────────────────────────────────
  const handleScan = useCallback(
    async (token) => {
      if (processingRef.current || scanState !== "idle") return;

      processingRef.current = true;

      setScanState("loading");

      try {
        const res = await scanQR(token);
        const data = res.data;

        setResult({
          type: "success",
          data,
        });

        setScanState("success");

        // stop camera after result
        setScannerActive(false);
      } catch (err) {
        const failReason =
          err.response?.data?.failReason ??
          err.response?.data?.reason ??
          "invalid_token";

        setResult({
          type: "failure",
          failReason,
        });

        setScanState("failure");

        // stop camera after result
        setScannerActive(false);
      }
    },
    [scanState],
  );

  // ── Scan again ───────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    processingRef.current = false;

    setResult(null);
    setScanState("idle");

    // reopen camera
    setScannerActive(true);
  }, []);

  // ── Start scanner manually ───────────────────────────────────────
  const handleStartScanner = () => {
    processingRef.current = false;
    setResult(null);
    setScanState("idle");
    setScannerActive(true);
  };

  // ── Logout ───────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      // stop camera immediately
      setScannerActive(false);

      await logoutUser();
    } catch (error) {
    } finally {
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    }
  };

  const timeStr = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dateStr = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="relative z-20 flex items-center justify-between px-5 py-3 bg-slate-950/90 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <p className="text-white text-sm font-bold leading-tight">Libro</p>
            <p className="text-slate-500 text-xs leading-tight">Guard Panel</p>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <p className="text-white font-bold text-base tabular-nums leading-tight">
            {timeStr}
          </p>

          <p className="text-slate-500 text-xs leading-tight">{dateStr}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {online ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
            )}

            <span
              className={`text-xs font-medium ${
                online ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {online ? "Online" : "Offline"}
            </span>
          </div>

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
                {user.firstName?.[0]?.toUpperCase() ?? "G"}
              </div>

              <span className="text-white text-xs font-medium">
                {user.firstName[0].toUpperCase() + user.firstName.slice(1)}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="relative overflow-hidden"
          style={{
            width: "min(100vw, 480px)",
            height: "min(100vw, 480px)",
          }}
        >
          {/* CAMERA */}
          {scannerActive ? (
            <ScanViewfinder
              onScanSuccess={handleScan}
              paused={scanState !== "idle"}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-slate-900">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Camera className="w-10 h-10 text-amber-400" />
              </div>

              <div className="text-center px-6">
                <p className="text-white text-lg font-bold">QR Scanner Ready</p>

                <p className="text-slate-500 text-sm mt-2">
                  Click below to start camera scanning
                </p>
              </div>

              <button
                onClick={handleStartScanner}
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl transition-colors"
              >
                <Camera className="w-5 h-5" />
                Start Scanner
              </button>
            </div>
          )}

          {/* LOADING */}
          {scanState === "loading" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm gap-3">
              <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />

              <p className="text-white text-sm font-medium">Verifying QR…</p>
            </div>
          )}

          {/* RESULT */}
          {(scanState === "success" || scanState === "failure") && result && (
            <ScanResult result={result} onReset={handleReset} />
          )}
        </div>

        {scanState === "idle" && scannerActive && (
          <div className="mt-6 text-center px-6 pointer-events-none">
            <p className="text-white text-base font-semibold">
              Point camera at QR code
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Hold steady — scanning automatically
            </p>
          </div>
        )}

        {!online && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-600 px-4 py-2.5 flex items-center justify-center gap-2 z-30">
            <WifiOff className="w-4 h-4 text-white" />

            <p className="text-white text-sm font-semibold">
              No internet — scans won't be verified until reconnected
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative z-20 px-5 py-3 bg-slate-950/90 backdrop-blur-sm border-t border-white/5">
        <div className="flex items-center justify-between max-w-[480px] mx-auto">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                scanState === "idle"
                  ? "bg-amber-400 animate-pulse"
                  : scanState === "loading"
                    ? "bg-blue-400 animate-pulse"
                    : scanState === "success"
                      ? "bg-emerald-400"
                      : "bg-red-400"
              }`}
            />

            <span className="text-slate-400 text-xs">
              {scanState === "idle" && "Ready to scan"}
              {scanState === "loading" && "Verifying…"}
              {scanState === "success" && "Scan successful"}
              {scanState === "failure" && "Scan failed"}
            </span>
          </div>

          <span className="text-slate-600 text-xs">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
