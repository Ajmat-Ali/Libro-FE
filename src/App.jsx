import AppRouter from "./routes/AppRoutes";
import { refreshToken } from "./api/auth.api";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/slices/authSlice";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();

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

  return <AppRouter />;
}

export default App;
