import { createFileRoute } from "@tanstack/react-router";
import { AdminAlerts } from "@/pages/admin/AdminInsights";
export const Route = createFileRoute("/admin/alerts")({ component: AdminAlerts });
