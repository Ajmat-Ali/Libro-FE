import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  IndianRupee,
  TrendingUp,
  UserCheck,
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Scan,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getOwnerDashboard } from "../../api/owner.api";

// ----------------- HELPER FUNCTIONS --------------------------

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

//------------------- STAT CARD --------------------------
const StatCard = ({ icon: Icon, label, value, color, subtitle }) => {
  const colorMap = {
    blue: "bg-blue-50   dark:bg-blue-500/10   text-blue-600   dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber:
      "bg-amber-50  dark:bg-amber-500/10  text-amber-600  dark:text-amber-400",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
    cyan: "bg-cyan-50   dark:bg-cyan-500/10   text-cyan-600   dark:text-cyan-400",
    orange:
      "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

// ------------------  SKELETON CARD (loading placeholder) ----------------------
const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
        <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-12" />
      </div>
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    </div>
  </div>
);

// ------------------  CUSTOM CHART TOOLTIP -----------------------------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-sm shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="font-semibold">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
        <p className="text-slate-400 text-xs">
          {payload[0].payload.count} payment(s)
        </p>
      </div>
    );
  }
  return null;
};

// ── MAIN COMPONENT ────────────────────────────────────────────────
const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getOwnerDashboard();
        setData(response);
      } catch (err) {
        setError("Failed to load dashboard. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Transform graph data for Recharts

  const chartData =
    data?.revenueGraph?.map((item) => ({
      date: formatDate(item._id),
      revenue: item.total,
      count: item.count,
    })) || [];

  // Safe destructuring with fallbacks
  const stats = data?.stats || {};
  const revenue = data?.revenue || {};
  const alerts = data?.alerts || {};
  const recentScans = data?.recentScans || [];

  return (
    <div className="p-4 lg:p-6 space-y-6 font-['DM_Sans']">
      {/* ---------------------- PAGE HEADER -----------------------------*/}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Welcome back — here's what's happening today
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* --------------------------- STATS GRID-------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Members"
              value={stats.totalMembers ?? 0}
              color="blue"
            />
            <StatCard
              icon={BookOpen}
              label="Active Bookings"
              value={stats.activeBookings ?? 0}
              color="emerald"
            />
            <StatCard
              icon={IndianRupee}
              label="Today's Revenue"
              value={formatCurrency(revenue.today)}
              color="amber"
            />
            <StatCard
              icon={TrendingUp}
              label="Monthly Revenue"
              value={formatCurrency(revenue.thisMonth)}
              color="purple"
            />
            <StatCard
              icon={UserCheck}
              label="Today's Attendance"
              value={stats.todayAttendance ?? 0}
              color="cyan"
            />
            <StatCard
              icon={Building2}
              label="Occupancy Rate"
              value={stats.occupancyRate ?? "0%"}
              color="orange"
              subtitle={`of ${stats.totalSeats ?? 0} total seats`}
            />
          </>
        )}
      </div>

      {/* --------------------- REVENUE CHART + QUICK ALERTS ---------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart — spans 2 columns */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Revenue Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Last 30 days
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full font-medium">
              {formatCurrency(revenue.thisMonth)} this month
            </span>
          </div>

          {loading ? (
            <div className="h-52 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
          ) : chartData.length === 0 ? (
            <div className="h-52 flex items-center justify-center">
              <p className="text-slate-400 text-sm">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick alerts column */}
        <div className="space-y-4">
          {/* Pending approvals */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "—" : (stats.pendingApprovals ?? 0)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Pending Approvals
                </p>
              </div>
            </div>
            {!loading && stats.pendingApprovals > 0 && (
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                Needs your attention
              </p>
            )}
          </div>

          {/* Expiring memberships */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5  border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Expiring Soon
            </h3>

            {loading ? (
              <div className="space-y-2">
                {Array(2)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"
                    />
                  ))}
              </div>
            ) : alerts.expiringMemberships?.length === 0 ? (
              <p className="text-sm text-slate-400">
                All memberships are active
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {alerts.expiringMemberships?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.studentName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.slot} · Seat {item.seat}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${
                        item.daysLeft <= 1
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {item.daysLeft === 0 ? "Today" : `${item.daysLeft}d left`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------- DEFAULTERS + RECENT SCANS ------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 ">
        {/* Defaulters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 ">
            <IndianRupee className="w-4 h-4 text-red-500" />
            Defaulters
            {!loading && alerts.defaulters?.length > 0 && (
              <span className="ml-auto text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                {alerts.defaulters.length} pending
              </span>
            )}
          </h3>

          {loading ? (
            <div className="space-y-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"
                  />
                ))}
            </div>
          ) : alerts.defaulters?.length === 0 ? (
            <p className="text-sm text-slate-400">No pending dues 🎉</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700 ">
              {alerts.defaulters?.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.studentName}
                    </p>
                    <p className="text-xs text-slate-500">{item.phone}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(item.amountDue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent scans */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Scan className="w-4 h-4 text-blue-500" />
            Recent Scans
            {!loading && stats.todayFailedScans > 0 && (
              <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {stats.todayFailedScans} failed today
              </span>
            )}
          </h3>

          {loading ? (
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse"
                  />
                ))}
            </div>
          ) : recentScans.length === 0 ? (
            <p className="text-sm text-slate-400">No recent scans</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentScans.map((scan) => (
                <div
                  key={scan._id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    {scan.scanResult === "success" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {scan.studentId
                          ? `${scan.studentId.firstName} ${scan.studentId.lastName}`
                          : "Unknown token"}
                      </p>
                      <p className="text-xs text-slate-500">
                        by {scan.scannedBy.firstName} {scan.scannedBy.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      {formatTime(scan.scanTime)}
                    </p>
                    <p className="text-xs text-slate-400 pb-1">
                      {formatDate(scan.scanTime)}
                    </p>

                    {scan.scanResult === "failed" && (
                      <p className="text-xs text-red-400 capitalize">
                        {scan.failReason?.replace(/_/g, " ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
