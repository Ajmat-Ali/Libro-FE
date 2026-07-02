import { CheckCircle, XCircle } from "lucide-react";

const Toast = ({ toastData: { type = "success", message } }) => {
  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-2 left-5 z-100 m-auto flex items-center gap-3 min-w-[300px]- w-64 rounded-xl border px-4 py-3
        shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-300
        ${
          isSuccess
            ? `border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300`
            : `border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300`
        }
      `}
    >
      <div>{isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}</div>

      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Toast;
