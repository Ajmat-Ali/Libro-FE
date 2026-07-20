import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  CalendarDays,
  LayoutGrid,
  QrCode,
  User,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";
import { clearCredentials } from "../store/slices/authSlice";
import { logoutUser } from "../api/auth.api";
import { LIBRARY_NAME } from "../constant";

const NAV_ITEMS = [
  { to: "/student/dashboard", label: "Dashboard", icon: Home },
  { to: "/student/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/student/browse", label: "Book Seat", icon: LayoutGrid },
  { to: "/student/qr", label: "My QR", icon: QrCode },
  { to: "/student/profile", label: "Profile", icon: User },
];

const getInitials = (firstName, lastName) => {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  return initials.toUpperCase() || "U";
};

const StudentLayout = () => {
  const [isDark, setIsDark] = useDarkMode();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
    } finally {
      dispatch(clearCredentials());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="hidden md:block sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <span className="font-serif text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {LIBRARY_NAME}
            </span>
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center justify-center">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <header className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-serif text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Libro
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center justify-center ml-1">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 pt-5 pb-24 md:pb-10">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-700 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-2 pt-2.5 pb-2 text-[10.5px] font-medium transition ${
                  isActive
                    ? "text-amber-500"
                    : "text-slate-400 dark:text-slate-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 w-8 h-0.5 rounded-full bg-amber-500" />
                  )}
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default StudentLayout;
