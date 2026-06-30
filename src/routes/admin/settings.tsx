import { createFileRoute } from "@tanstack/react-router";
import { AdminSettings } from "@/pages/admin/AdminInsights";
export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });
