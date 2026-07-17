import AppRouter from "./routes/AppRoutes";
import { refreshToken } from "./api/auth.api";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./store/slices/authSlice";
import { Hourglass } from "lucide-react";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();
  const authData = useSelector((store) => store.auth);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshToken();

        dispatch(
          setCredentials({
            user: response.userData,
            accessToken: response.accessToken,
          }),
        );
      } catch (error) {
        if (error?.response?.data?.status === 429) {
          dispatch(setCredentials({ error: error?.response?.data?.message }));
        }
      } finally {
        setAuthChecked(true);
      }
    };

    restoreSession();
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authData.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-lg">
          <div className="mb-4 text-5xl">⏳{/* <Hourglass /> */}</div>

          <h1 className="mb-2 text-2xl font-bold text-red-600">
            Too Many Requests
          </h1>

          <p className="text-gray-600">{authData.error} </p>

          <p className="mt-4 text-sm text-gray-500">
            Please wait a few minutes before trying again. This limit helps keep
            your account and our servers secure.
          </p>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

export default App;
