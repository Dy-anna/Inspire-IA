import { createFileRoute } from "@tanstack/react-router";
import { AdminCompanies } from "@/pages/admin/AdminCompanies";
export const Route = createFileRoute("/admin/companies")({ component: AdminCompanies });
