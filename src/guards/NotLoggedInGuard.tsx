import { useAuth } from "@/context/auth";
import { Outlet } from "react-router";
import { Navigate } from "react-router";

export function NotLoggedInGuard() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      </div>
    );

  if (isLoggedIn) return <Navigate to="/" />;

  return <Outlet />;
}
