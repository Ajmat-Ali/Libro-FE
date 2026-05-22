import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  ShieldOff,
  Edit2,
  Clock,
} from "lucide-react";
import { getOneMember, toggleMemberStatus } from "../../../api/owner.api";
import UpdateMemberDrawer from "./UpdateMemberDrawer";

// Status config
const statusConfig = {
  approved: {
    label: "Active",
    ring: "ring-emerald-500",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/20 text-emerald-400",
  },
  pending: {
    label: "Pending",
    ring: "ring-amber-500",
    dot: "bg-amber-500",
    badge: "bg-amber-500/20 text-amber-400",
  },
  rejected: {
    label: "Rejected",
    ring: "ring-red-500",
    dot: "bg-red-500",
    badge: "bg-red-500/20 text-red-400",
  },
  suspended: {
    label: "Suspended",
    ring: "ring-orange-500",
    dot: "bg-orange-500",
    badge: "bg-orange-500/20 text-orange-400",
  },
};

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div
      className="flex items-start gap-3 py-3 border-b border-slate-100
                    dark:border-slate-700/50 last:border-0"
    >
      <div
        className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/50
                      flex items-center justify-center flex-shrink-0 mt-0.5"
      >
        <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
};

const MemberDetailPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const response = await getOneMember(memberId);
      // Handle both { member } and direct object responses
      setMember(response.member || response);
    } catch {
      setError("Failed to load member details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [memberId]);

  const handleToggleStatus = async () => {
    try {
      setToggling(true);
      await toggleMemberStatus(memberId);
      fetchMember();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 border-4 border-amber-500 border-t-transparent
                        rounded-full animate-spin"
        />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500
                           hover:text-slate-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-red-500 text-sm">{error || "Member not found"}</p>
      </div>
    );
  }

  const user = member.userId || member;
  const isActive = user?.isActive ?? true;
  const statusKey = !isActive
    ? "suspended"
    : member.approvalStatus || "pending";
  const status = statusConfig[statusKey] || statusConfig.pending;

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <>
      {showUpdate && (
        <UpdateMemberDrawer
          member={member}
          onClose={() => setShowUpdate(false)}
          onSuccess={() => {
            setShowUpdate(false);
            fetchMember();
          }}
        />
      )}

      <div className="font-['DM_Sans']">
        {/* ── DARK HERO HEADER ─────────────────────────────── */}
        <div className="bg-slate-900 px-4 lg:px-6 pt-6 pb-16">
          {/* Back nav */}
          <button
            onClick={() => navigate("/owner/members")}
            className="flex items-center gap-2 text-slate-400 hover:text-white
                       text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            All Members
          </button>

          {/* Member identity */}
          <div className="flex items-start gap-5">
            {/* Avatar with status ring */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-full bg-amber-500 flex items-center
                               justify-center text-slate-900 text-xl font-bold
                               ring-2 ring-offset-2 ring-offset-slate-900
                               ${status.ring}`}
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {/* Online dot */}
              <span
                className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5
                               rounded-full border-2 border-slate-900 ${status.dot}`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-white font-['Playfair_Display']">
                  {user?.firstName} {user?.lastName || ""}
                </h1>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold
                                  flex-shrink-0 ${status.badge}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
              {member.membershipId && (
                <p
                  className="text-amber-400 text-xs font-mono mt-1.5
                              tracking-wide"
                >
                  {member.membershipId}
                </p>
              )}
            </div>

            {/* Edit button */}
            <button
              onClick={() => setShowUpdate(true)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2
                         bg-white/10 hover:bg-white/20 text-white text-sm
                         font-medium rounded-xl transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </div>

        {/* ── CONTENT (pulls up over hero) ─────────────────── */}
        <div className="px-4 lg:px-6 -mt-10 pb-10 space-y-4">
          {/* Grid: info cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile info — 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Personal + Contact card */}
              <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-5
                              border border-slate-100 dark:border-slate-700"
              >
                <h3
                  className="text-xs font-semibold text-slate-500
                               dark:text-slate-400 uppercase tracking-wider mb-3"
                >
                  Contact Info
                </h3>
                <InfoRow icon={Mail} label="Email" value={user?.email} />
                <InfoRow icon={Phone} label="Phone" value={member.phone} />
                <InfoRow icon={MapPin} label="Address" value={member.address} />
                <InfoRow
                  icon={Calendar}
                  label="Member Since"
                  value={new Date(member.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                />
                <InfoRow
                  icon={Clock}
                  label="Email Verified"
                  value={member.isEmailVerified ? "Verified ✓" : "Not verified"}
                />
              </div>

              {/* Membership card */}
              <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-5
                              border border-slate-100 dark:border-slate-700"
              >
                <h3
                  className="text-xs font-semibold text-slate-500
                               dark:text-slate-400 uppercase tracking-wider mb-3"
                >
                  Membership
                </h3>
                <InfoRow
                  icon={Shield}
                  label="Membership ID"
                  value={member.membershipId || "Not assigned yet"}
                />
                {member.reviewedAt && (
                  <InfoRow
                    icon={Calendar}
                    label="Reviewed On"
                    value={new Date(member.reviewedAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  />
                )}
                {member.rejectionReason && (
                  <div
                    className="mt-2 p-3 bg-red-50 dark:bg-red-500/10
                                  rounded-xl border border-red-100
                                  dark:border-red-500/20"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Rejection reason
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-0.5">
                      {member.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions sidebar — 1 col */}
            <div className="space-y-4">
              {/* Quick actions */}
              <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-5
                              border border-slate-100 dark:border-slate-700"
              >
                <h3
                  className="text-xs font-semibold text-slate-500
                               dark:text-slate-400 uppercase tracking-wider mb-4"
                >
                  Actions
                </h3>

                <button
                  onClick={() => setShowUpdate(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                             bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100
                             dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300
                             text-sm font-medium transition-all mb-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Details
                </button>
              </div>

              {/* Danger zone */}
              <div
                className="bg-white dark:bg-slate-800 rounded-2xl p-5
                              border border-red-100 dark:border-red-500/20"
              >
                <h3
                  className="text-xs font-semibold text-red-500 uppercase
                               tracking-wider mb-1"
                >
                  Danger Zone
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                  {isActive
                    ? "Suspending will immediately revoke the member's QR access and log them out from all devices."
                    : "Reactivating will restore the member's access and they can log in again."}
                </p>
                <button
                  onClick={handleToggleStatus}
                  disabled={toggling}
                  className={`w-full flex items-center justify-center gap-2 py-2.5
                             text-sm font-semibold rounded-xl transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed
                             ${
                               isActive
                                 ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30"
                                 : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30"
                             }`}
                >
                  {toggling ? (
                    <svg
                      className="animate-spin w-4 h-4"
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
                  ) : isActive ? (
                    <>
                      <ShieldOff className="w-4 h-4" /> Suspend Member
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" /> Reactivate Member
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDetailPage;
