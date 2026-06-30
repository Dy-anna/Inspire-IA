import { createFileRoute } from "@tanstack/react-router";
import ChatboxPage from "@/pages/ChatboxPage";
export const Route = createFileRoute("/app/chatbox")({ component: ChatboxPage });
