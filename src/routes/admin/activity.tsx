import { createFileRoute } from "@tanstack/react-router";
import { AdminActivity } from "@/pages/admin/AdminInsights";
export const Route = createFileRoute("/admin/activity")({ component: AdminActivity });
