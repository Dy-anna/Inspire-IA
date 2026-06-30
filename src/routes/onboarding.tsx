import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/LoadingState";
import OnboardingPage from "@/pages/OnboardingPage";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingRoute,
});

function OnboardingRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
    else if (!loading && user?.onboarding_completed) navigate({ to: "/app/crm" });
  }, [loading, user, navigate]);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoadingScreen label="Redirection..." />;
  return <OnboardingPage />;
}
