import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordSuccess({ flag, secs }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (secs <= 0) {
      navigate("/login");
    }
  }, [secs, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-2xl font-bold text-slate-800">
          Password Reset Successful
        </h1>

        {/* Description */}
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Your password has been updated successfully. You can now log in using
          your new password.
        </p>

        {/* Timer Section */}
        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Redirecting to login page in</p>

          <span className="mt-2 block text-3xl font-bold text-indigo-600">
            {secs}
          </span>

          {/* Replace 5s with your state variable */}
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
