import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const QUOTES = [
  {
    text: "A reader lives a thousand lives before he dies.",
    author: "George R.R. Martin",
  },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "So many books, so little time.", author: "Frank Zappa" },
  { text: "A book is a dream you hold in your hands.", author: "Neil Gaiman" },
];

const quote = QUOTES[new Date().getDay() % QUOTES.length];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ══ LEFT PANEL (desktop only) ══════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden flex-col">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600" />

        {/* Decorative blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-black tracking-tight font-['Playfair_Display']">
              Libro
            </span>
          </div>

          {/* Center illustration area */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {/* Book stack illustration (CSS-only) */}
            <div className="relative w-40 h-44">
              {/* Book 3 (back) */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 rounded-lg bg-white/15 border border-white/20"
                style={{
                  transform: "translateX(-50%) rotate(-8deg) translateY(0px)",
                }}
              />
              {/* Book 2 (middle) */}
              <div
                className="absolute bottom-4 left-1/2 w-36 h-28 rounded-xl bg-white/20 border border-white/25 backdrop-blur-sm"
                style={{ transform: "translateX(-50%) rotate(3deg)" }}
              >
                <div className="absolute top-3 left-4 right-4 space-y-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 bg-white/30 rounded-full"
                      style={{ width: `${75 - i * 8}%` }}
                    />
                  ))}
                </div>
              </div>
              {/* Book 1 (front) */}
              <div
                className="absolute bottom-6 left-1/2 w-32 h-36 rounded-xl bg-white/30 border border-white/40 backdrop-blur-sm shadow-xl"
                style={{ transform: "translateX(-50%) rotate(-4deg)" }}
              >
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-3 bg-white/20 rounded-l-xl" />
                </div>
                <div className="absolute top-4 left-6 right-4 space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 bg-white/40 rounded-full"
                      style={{ width: `${90 - i * 10}%` }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-4 left-6 right-4">
                  <div className="h-1.5 bg-white/30 rounded-full w-3/4" />
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="text-center max-w-xs">
              <p className="text-white/90 text-base font-medium italic leading-relaxed font-['Playfair_Display']">
                "{quote.text}"
              </p>
              <p className="text-white/60 text-sm mt-2">— {quote.author}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Libro Library System
            </p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — form ══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center px-5 sm:px-8 py-10">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white text-lg font-black font-['Playfair_Display']">
              Libro
            </span>
          </div>

          {/* Form card */}
          <div className="w-full max-w-[420px]">
            {/* Heading */}
            {(title || subtitle) && (
              <div className="mb-7">
                {title && (
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display']">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
