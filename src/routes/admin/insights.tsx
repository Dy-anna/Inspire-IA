import { createFileRoute } from "@tanstack/react-router";
import { AdminInsights } from "@/pages/admin/AdminInsights";
export const Route = createFileRoute("/admin/insights")({ component: AdminInsights });
