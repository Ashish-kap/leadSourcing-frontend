import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FeedbackFloatingButton } from "@/components/feedback/FeedbackFloatingButton";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Keep the query string so referral/UTM params (e.g. /?ref=CODE)
      // survive the redirect and the login page can capture them.
      navigate(`/login${location.search}`, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <>
      <Outlet />
      <FeedbackFloatingButton />
    </>
  ) : null;
};
