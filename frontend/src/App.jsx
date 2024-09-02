import { Routes, Route, Navigate } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  SignUpPage,
  NotificationPage,
  ProfilePage,
} from "./pages/pages";
import { Sidebar, RightPanel, LoadingSpinner } from "./components/components";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
function App() {
  const {
    data: authUser,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) {
          return null;
        }
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        // console.log(data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser ? <Sidebar /> : ""}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/" />}
        />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
      {authUser ? <RightPanel /> : ""}
      <Toaster />
    </div>
  );
}

export default App;
