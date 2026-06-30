import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingScreen } from "@/components/ui/LoadingState";

export const Route = createFileRoute("/app")({
  component: AppRoute,
});

function AppRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
    } else if (!user.onboarding_completed) {
      navigate({ to: "/onboarding" });
    }
  }, [loading, user, navigate]);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoadingScreen label="Redirection..." />;
  if (!user.onboarding_completed) return <LoadingScreen label="Redirection vers l'onboarding..." />;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
