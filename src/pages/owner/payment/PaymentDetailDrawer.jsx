import { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  Download,
  FileText,
  Banknote,
  Smartphone,
} from "lucide-react";
import { getOnePayment, downloadReceipt } from "../../../api/owner.api";

import ModeBadge from "./components/ModeBadge";
import DrawerSkeleton from "./components/DrawerSkeleton";
import PaymentDrawerSummary from "./components/PaymentDrawerSummary";

export default function PaymentDetailDrawer({ paymentId, onClose }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    setLoading(true);
    getOnePayment(paymentId)
      .then((res) => setPayment(res.data.payment))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [paymentId]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReceipt(paymentId);
    } catch {
    } finally {
      setDownloading(false);
    }
  };

  const isPaid = payment?.status === "paid";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[440px] h-full bg-white dark:bg-slate-800 flex flex-col shadow-xl animate-slideInRight">
        <div className=" flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Payment Details
            </h2>
            {payment && (
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                #{payment._id.slice(-8).toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <DrawerSkeleton />
          ) : !payment ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <FileText className="w-8 h-8 mb-2" />
              <p className="text-sm">Could not load payment</p>
            </div>
          ) : (
            <PaymentDrawerSummary payment={payment} isPaid={isPaid} />
          )}
        </div>

        {isPaid && !loading && (
          <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
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
              ) : (
                <Download className="w-4 h-4" />
              )}
              {downloading ? "Downloading…" : "Download Receipt PDF"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
