import { useState, useEffect, useCallback } from "react";
import { Search, UserCheck, UserX, Users } from "lucide-react";
import { getMembers, reviewMember } from "../../api/owner.api";
import SkeletonRow from "./components/MemberSkeletonRow";
import Avatar from "./components/MemberAvatar";
import { ActiveStatusBadge, StatusBadge } from "./components/MemberStatusBadge";
import RejectModal from "./components/MemberRejectModel";
import AddWalkInDrawer from "./members/AddWalkInDrawer";
import { useNavigate } from "react-router-dom";

// ── FILTER TABS ───────────────────────────────────────────────────
const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

// ---------------------------- MAIN COMPONENT -------------------------------
const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [rejectModal, setRejectModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const navigate = useNavigate();

  // ------------------------------ FETCH ----------------------------------
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search) params.search = search;
      if (activeFilter !== "all") params.approvalStatus = activeFilter;
      params.page = currentPage;

      const response = await getMembers(params);

      setMembers(response.members || []);
      setTotal(response.total || 0);
      setTotalPages(response.totalPages || 1);
      setLimit(response.limit || 10);
    } catch {
      setError("Failed to load members. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [search, activeFilter, currentPage]);

  useEffect(() => {
    const timer = setTimeout(fetchMembers, 400);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);

  // --------------------------- APPROVE ------------------------------------
  const handleApprove = async (member) => {
    try {
      setActionLoading(member._id);
      setError("");
      await reviewMember(member._id, { action: "approve" });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve member.");
    } finally {
      setActionLoading(null);
    }
  };

  // ------------------------- REJECT ----------------------
  const handleRejectConfirm = async (reason) => {
    try {
      setActionLoading(rejectModal.member._id);
      setError("");
      await reviewMember(rejectModal.member._id, {
        action: "reject",
        rejectionReason: reason,
      });
      setRejectModal(null);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject member.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      {/* Rejection modal */}
      {rejectModal && (
        <RejectModal
          member={rejectModal.member}
          onClose={() => setRejectModal(null)}
          onConfirm={handleRejectConfirm}
          isLoading={actionLoading === rejectModal.member._id}
        />
      )}

      <div className="p-4 lg:p-6 space-y-5 font-['DM_Sans']">
        {/* -------------------------------- PAGE HEADER ---------------------------- */}
        <div className="flex items-start justify-between gap-4 ">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Playfair_Display']">
              Members
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {loading ? "Loading..." : `${total} total members`}
            </p>
          </div>
          {/* Part 2 — Add Member button */}
          <button
            onClick={() => setShowAddDrawer(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-semibold rounded-xl transition-all flex-shrink-0"
          >
            + Add Member
          </button>
          {showAddDrawer && (
            <AddWalkInDrawer
              onClose={() => setShowAddDrawer(false)}
              onSuccess={() => {
                setShowAddDrawer(false);
                fetchMembers();
              }}
            />
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* -------------------------- SEARCH + FILTERS ------------------------------ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2    w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className=" flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex-shrink-0">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${
                    activeFilter === tab.key
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABLE ────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sm:table-cell">
                    Active Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sm:table-cell">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <SkeletonRow key={i} />)
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        No members found
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {search
                          ? "Try a different search term"
                          : "Members will appear here"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const user = member.userId;
                    const isPending = member.approvalStatus === "pending";
                    const isActioning = actionLoading === member._id;

                    return (
                      <tr
                        key={member._id}
                        // onClick={() => navigate(`/owner/members/${member._id}`)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                      >
                        {/* Member info */}
                        <td
                          onClick={() =>
                            navigate(`/owner/members/${member._id}`)
                          }
                          className="px-4 py-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              firstName={user?.firstName}
                              lastName={user?.lastName}
                              photo={member.photo}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {user?.firstName} {user?.lastName || ""}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user?.email}
                              </p>
                              {member.membershipId && (
                                <p className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                                  {member.membershipId}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td
                          onClick={() =>
                            navigate(`/owner/members/${member._id}`)
                          }
                          className="px-4 py-3.5"
                        >
                          <span className="text-sm text-slate-600 dark:text-slate-300 font-mono">
                            {member.phone || "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td
                          onClick={() =>
                            navigate(`/owner/members/${member._id}`)
                          }
                          className="px-4 py-3.5"
                        >
                          <StatusBadge
                            approvalStatus={member.approvalStatus}
                            isActive={user?.isActive ?? true}
                          />
                        </td>

                        {/* Active Status */}
                        <td
                          onClick={() =>
                            navigate(`/owner/members/${member._id}`)
                          }
                          className="px-4 py-3.5"
                        >
                          <ActiveStatusBadge
                            isActive={user?.isActive ?? true}
                          />
                        </td>

                        {/* Joined date */}
                        <td
                          onClick={() =>
                            navigate(`/owner/members/${member._id}`)
                          }
                          className="px-4 py-3.5  sm:table-cell"
                        >
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(member.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          {isPending ? (
                            <div className="flex items-center gap-2">
                              {/* Approve */}
                              <button
                                onClick={() => handleApprove(member)}
                                disabled={isActioning}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isActioning ? (
                                  <svg
                                    className="animate-spin w-3 h-3"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8v8z"
                                    />
                                  </svg>
                                ) : (
                                  <UserCheck className="w-3 h-3" />
                                )}
                                Approve
                              </button>

                              {/* Reject */}
                              <button
                                onClick={() => setRejectModal({ member })}
                                disabled={isActioning}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <UserX className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer — total count */}
          {/* {!loading && members.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {members.length} of {total} members
              </p>
            </div>
          )} */}

          {/* ------------------------------------------------------------ */}
          {!loading && members.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {limit * currentPage - limit + members.length} of{" "}
                {total} members
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MembersPage;
