import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  TrendingUp,
  Clock,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  CheckCircle,
} from "lucide-react";
import { getPayments } from "../../api/owner.api";
import PaymentDetailDrawer from "./payment/PaymentDetailDrawer";

import RecordCashDrawer from "./payment/RecordCashDrawer";
import SkeletonRow from "./payment/components/SkeletonRow";
import StatCard from "./payment/components/StatCard";
import PaymentRow from "./payment/components/PaymentRow";

const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const LIMIT = 10;

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");

  const [detailId, setDetailId] = useState(null);
  const [recordPayment, setRecordPayment] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchPayments = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        const params = { page: pageNum, limit: LIMIT };
        if (statusFilter) params.status = statusFilter;
        if (modeFilter) params.paymentMode = modeFilter;

        const res = await getPayments(params);
        const data = res.data;

        setPayments(data.payments);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(pageNum);

        const { paid, pending } = data.formatted;

        setStats({
          collected: {
            totalAmount: fmt(paid.totalAmount),
            count: paid.totalCount,
          },
          pending: {
            totalAmount: fmt(pending.totalAmount),
            count: pending.totalCount,
          },
          total: paid?.totalCount + pending?.totalCount,
        });
      } catch (err) {
        console.error("Failed to load payments:", err);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, modeFilter],
  );

  useEffect(() => {
    fetchPayments(1);
  }, [fetchPayments]);

  const displayed = search
    ? payments.filter((p) => {
        const name =
          `${p.studentId.firstName} ${p.studentId.lastName}`.toLowerCase();
        const email = p.studentId.email.toLowerCase();
        return (
          name.includes(search.toLowerCase()) ||
          email.includes(search.toLowerCase())
        );
      })
    : payments;

  const handleRecordSuccess = () => {
    setRecordPayment(null);
    showToast("Payment marked as received");
    fetchPayments(page);
  };

  return (
    <div className="font-['DM_Sans'] min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-slate-900 px-4 lg:px-6 pt-6 pb-16">
        <div className="flex items-center gap-3 mb-1">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl font-bold text-white font-['Playfair_Display']">
            Payments
          </h1>
        </div>
        <p className="text-slate-400 text-sm">
          Track collections and mark cash payments as received
        </p>
      </div>

      <div className="px-4 lg:px-6 -mt-10 pb-10 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Total collected"
            value={stats?.collected?.totalAmount}
            count={stats?.collected?.count}
            color={{
              bg: "bg-emerald-50 dark:bg-emerald-500/10",
              icon: "text-emerald-600 dark:text-emerald-400",
              text: "text-emerald-700 dark:text-emerald-400",
            }}
          />
          <StatCard
            icon={Clock}
            label="Pending dues"
            value={stats?.pending?.totalAmount}
            count={stats?.pending?.count}
            color={{
              bg: "bg-amber-50 dark:bg-amber-500/10",
              icon: "text-amber-600 dark:text-amber-400",
              text: "text-amber-700 dark:text-amber-400",
            }}
          />
          <StatCard
            icon={Receipt}
            label="Total payments"
            value={stats?.total != null ? stats.total : null}
            color={{
              bg: "bg-slate-100 dark:bg-slate-700",
              icon: "text-slate-500 dark:text-slate-400",
              text: "text-slate-800 dark:text-slate-200",
            }}
          />
        </div>

        <div className="border- flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by member name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
          >
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
          >
            <option value="">All modes</option>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                    Mode
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : displayed.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">
                        No payments found
                      </p>
                    </td>
                  </tr>
                ) : (
                  displayed.map((p) => (
                    <PaymentRow
                      key={p._id}
                      payment={p}
                      onView={() => setDetailId(p._id)}
                      onRecord={() => setRecordPayment(p)}
                      fmt={fmt}
                      fmtDate={fmtDate}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && total > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {(page - 1) * LIMIT + 1}-{Math.min(page * LIMIT, total)}{" "}
                of {total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fetchPayments(page - 1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => fetchPayments(n)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        n === page
                          ? "bg-amber-500 text-white border-0"
                          : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {n}
                    </button>
                  ),
                )}
                <button
                  onClick={() => fetchPayments(page + 1)}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {detailId && (
        <PaymentDetailDrawer
          paymentId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}

      {recordPayment && (
        <RecordCashDrawer
          payment={recordPayment}
          onClose={() => setRecordPayment(null)}
          onSuccess={handleRecordSuccess}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-slate-900 text-emerald-400 border border-emerald-500/30"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {toast.msg}
        </div>
      )}
    </div>
  );
}
