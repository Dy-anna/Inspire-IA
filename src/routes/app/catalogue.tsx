import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import Catalogue from "@/pages/catalogue/Catalogue";
import EventsPage from "@/pages/catalogue/EventsPage";

function CatalogueRouter() {
  const { user } = useAuth();
  // Event garde sa page dédiée (revenus/dépenses par événement,
  // trop différent d'un catalogue produit classique pour être généré).
  if (user?.sector === "event") return <EventsPage />;
  return <Catalogue />;
}

export const Route = createFileRoute("/app/catalogue")({ component: CatalogueRouter });
