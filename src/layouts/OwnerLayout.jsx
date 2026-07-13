import React, { useEffect, useState } from "react";
import { getOwnerLibrary } from "../api/owner.api";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  Building2,
  Clock,
  ClipboardList,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  Sun,
  Moon,
  Bell,
} from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth.api";
import { clearCredentials } from "../store/slices/authSlice";
import { setLibrary } from "../store/slices/library";

const navLinks = [
  { to: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/owner/members", label: "Members", icon: Users },
  { to: "/owner/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/owner/payments", label: "Payments", icon: CreditCard },
  { to: "/owner/floors", label: "Floors & Seats", icon: Building2 },
  { to: "/owner/slots", label: "Slots & Plans", icon: Clock },
  { to: "/owner/attendance", label: "Attendance", icon: ClipboardList },
  // { to: "/owner/announcements", label: "Announcements", icon: Megaphone },
  // { to: "/owner/reports", label: "Reports", icon: BarChart3 },
  { to: "/owner/settings", label: "Settings", icon: Settings },
];

const OwnerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();
  const [checking, setChecking] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkLibrary = async () => {
      try {
        const response = await getOwnerLibrary();
        dispatch(setLibrary(response.library));
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/owner/setup", { replace: true });
          return;
        }
      } finally {
        setChecking(false);
      }
    };
    checkLibrary();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
    } finally {
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-['DM_Sans']">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ------------------ SIDEBAR --------------------------*/}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 dark:bg-slate-950
        flex flex-col overflow-hidden z-30 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 
      `}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3 ">
            <div className="w-8 h-8 border  bg-amber-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              Libro
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                 font-medium transition-colors duration-150
                 ${
                   isActive
                     ? "bg-amber-500 text-slate-900"
                     : "text-slate-400 hover:text-white hover:bg-slate-800"
                 }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-0.5 ">
          <div className="px-3 py-2">
            <p className="text-white text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm font-medium text-slate-400 hover:text-white
                       hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 ">
        {/* Topbar */}
        <header className="sticky top-0 z-10 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block" />

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
