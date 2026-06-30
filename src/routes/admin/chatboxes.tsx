import { createFileRoute } from "@tanstack/react-router";
import AdminChatboxes from "@/pages/admin/AdminChatboxes";
export const Route = createFileRoute("/admin/chatboxes")({ component: AdminChatboxes });
