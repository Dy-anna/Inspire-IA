import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/pages/AboutPage";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "À propos — Inspire IA" },
      {
        name: "description",
        content:
          "Découvrez Inspire IA : une plateforme SaaS intelligente née pour construire des outils technologiques modernes, puissants et adaptés aux réalités des entreprises africaines.",
      },
    ],
  }),
});
