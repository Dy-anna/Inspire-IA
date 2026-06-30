import { createFileRoute } from "@tanstack/react-router";
import AdminLeads from "@/pages/admin/AdminLeads";
export const Route = createFileRoute("/admin/leads")({ component: AdminLeads });
