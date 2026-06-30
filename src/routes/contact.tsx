import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import ContactPage from "@/pages/ContactPage";

const contactSearchSchema = z.object({
  subject: z.string().optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: contactSearchSchema,
  head: ({ match }) => {
    const isPricing = match.search.subject === "tarifs";
    return {
      meta: [
        { title: isPricing ? "Devis personnalisé — Inspire IA" : "Contact — Inspire IA" },
        { name: "description", content: isPricing ? "Demandez un devis personnalisé pour Inspire IA. Réponse sous 24h." : "Contactez l'équipe Inspire IA pour une démo, une question ou un partenariat. Réponse sous 24h." },
        { property: "og:title", content: isPricing ? "Devis personnalisé — Inspire IA" : "Contact — Inspire IA" },
        { property: "og:description", content: isPricing ? "Demandez un devis adapté à votre entreprise. Notre équipe vous répond rapidement." : "Parlons de votre projet. Notre équipe vous répond rapidement." },
      ],
    };
  },
  component: ContactPage,
});
