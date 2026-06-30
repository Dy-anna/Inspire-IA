import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F7F5",
        fontFamily: "Inter",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <h1 style={{ fontSize: 64, fontWeight: 800, margin: 0, color: "#1A1A1A" }}>404</h1>
        <p style={{ marginTop: 8, color: "#787774" }}>Cette page n'existe pas.</p>
        <div style={{ marginTop: 20 }}>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "#1A1A1A",
              color: "#fff",
              borderRadius: 6,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F7F5",
        fontFamily: "Inter",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>
          Une erreur est survenue
        </h1>
        <p style={{ marginTop: 8, color: "#787774", fontSize: 14 }}>{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            background: "#1A1A1A",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter",
          }}
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Inspire IA — Le SaaS IA pour l'Afrique" },
      {
        name: "description",
        content:
          "CRM et chatbox WhatsApp IA pour restaurants, agences immobilières, voyages, écoles et cliniques en Afrique francophone.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body style={{ margin: 0, fontFamily: "Inter, sans-serif", background: "#F7F7F5" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function CacheInvalidator() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CacheInvalidator />
        <Outlet />
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{ style: { fontFamily: "Inter", fontSize: 14 } }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
