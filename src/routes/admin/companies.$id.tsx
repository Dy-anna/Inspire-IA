import { createFileRoute } from "@tanstack/react-router";
import { AdminCompanyDetail } from "@/pages/admin/AdminCompanies";

export const Route = createFileRoute("/admin/companies/$id")({
  component: () => {
    const { id } = Route.useParams();
    return <AdminCompanyDetail companyId={id} />;
  },
});
