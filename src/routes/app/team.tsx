import { createFileRoute } from "@tanstack/react-router";
import TeamPage from "@/pages/TeamPage";
export const Route = createFileRoute("/app/team")({ component: TeamPage });
