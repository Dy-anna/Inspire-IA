import { createFileRoute } from "@tanstack/react-router";
import CRM from "@/pages/crm/CRM";

export const Route = createFileRoute("/app/crm")({ component: CRM });