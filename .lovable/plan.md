## Objectif

Permettre à un visiteur non connecté d'aller sur `/demo`, choisir un des 5 secteurs (Restaurant, Immobilier, Voyage, École, Clinique), puis naviguer dans **toutes les pages du CRM** (Dashboard, CRM, Clients, Catalogue, Chatbox, Analytics, Équipe, Paramètres) avec des données fictives réalistes. Lecture seule "souple" : les boutons fonctionnent en état local (drag Kanban, cocher, éditer un champ) mais rien n'est sauvegardé — un refresh remet tout à zéro.

## Architecture

### 1. Mock Supabase client (`src/lib/demoSupabase.ts`)

Faux client qui imite l'API utilisée par les pages :
- `.from(table).select(...).eq().in().gte().lte().not().order().limit().range()`
- `.single() / .maybeSingle()`
- `select("id", { count: "exact", head: true })` → renvoie `{ count }`
- `.insert() / .update() / .upsert() / .delete()` → no-op qui renvoie `{ data: payload, error: null }`
- `.auth.getSession()` → renvoie une session factice
- `.storage` → no-op
- Realtime/`channel()` → stub silencieux

Le builder est *chainable* et applique réellement les filtres (eq, in, gte, lte) sur les fixtures en mémoire pour que les chiffres soient cohérents (CA, counts, etc.).

### 2. Fixtures par secteur (`src/lib/demoFixtures/`)

Un fichier par secteur (`restaurant.ts`, `realEstate.ts`, `travel.ts`, `school.ts`, `clinic.ts`) qui exporte un objet `{ tableName: rows[] }` :
- Tables communes : `companies`, `users`, `clients`, `chat_sessions`, `chat_messages`, `chatbots`, `company_secrets`
- Tables spécifiques : `orders` (resto), `properties`+`property_leads` (immo), `trip_packages`+`trip_bookings` (voyage), `students`+`school_classes`+`grades`+`absences` (école), `appointments`+`clinic_services` (clinique)
- ~10-30 lignes par table avec dates récentes, noms réalistes, statuts variés pour des graphes lisibles

### 3. Contexte démo (`src/contexts/DemoContext.tsx`)

- `DemoProvider` qui prend un `sector` en prop, fournit un faux `AppUser` (id `demo-user`, company_name `Démo — Le Baobab`, etc.) et bascule un flag global `__DEMO_MODE__`
- Réexporte `useAuth()` via override : si on est dans un subtree démo, renvoie le faux user au lieu du vrai

### 4. Switch client Supabase (`src/lib/supabase.ts`)

Le `supabase` exporté devient un proxy qui regarde `__DEMO_MODE__` :
- mode normal → vrai client
- mode démo → `demoSupabase`

Avantage : zéro changement dans les ~50 appels existants dans les pages.

### 5. Routes

```
src/routes/
  demo.tsx                    -> /demo (sélecteur de secteur, 5 cartes)
  demo.$sector.tsx            -> /demo/:sector (layout : DemoProvider + bannière + AppLayout)
  demo.$sector.dashboard.tsx
  demo.$sector.crm.tsx
  demo.$sector.clients.tsx
  demo.$sector.catalogue.tsx
  demo.$sector.chatbox.tsx
  demo.$sector.analytics.tsx
  demo.$sector.team.tsx
  demo.$sector.settings.tsx
```

Chaque route enfant importe et rend simplement la page existante (`<DashboardPage />`, etc.) — c'est le contexte qui injecte les fausses données.

### 6. UI

- **Sélecteur `/demo`** : 5 cartes secteur dans le style de la home (orange/vert/bleu/violet/rouge), même chartre graphique
- **Bannière démo** : barre sticky en haut (au-dessus du header AppLayout) avec "🎭 Mode démo — Restaurant Le Baobab · Aucune donnée n'est sauvegardée" + bouton "Changer de secteur" + bouton "Créer mon compte" → `/register`
- **AppLayout démo** : la nav latérale et toutes ses entrées pointent vers `/demo/$sector/*` au lieu de `/app/*` (via une prop `basePath` ajoutée à AppLayout, ou un fork léger)
- **Lien depuis la home** : ajouter "Voir la démo" dans le hero/nav, garder la démo CRM Kanban actuelle comme teaser

### 7. Mutations en lecture seule

Le mock `.update()/.insert()` renvoie un faux succès. Les pages qui utilisent `useState` local (édition inline Clients, drag Kanban Restaurant) verront leur état local muter normalement → l'utilisateur peut "jouer". Au refresh, les fixtures repartent intactes.

## Risques et garde-fous

- **Auth réelle non impactée** : le flag `__DEMO_MODE__` est local au subtree démo (via React context + un singleton scopé). On ne touche pas `AuthProvider` global.
- **Pages avec realtime** (chatbox) : le mock `channel()` est un no-op, le polling Supabase ne casse pas mais ne reçoit pas de nouveau message.
- **Variations de requêtes** : si une page utilise une combinaison non gérée par le mock builder, elle renvoie `[]` plutôt que crasher. Tests visuels page par page après scaffold.
- **Settings / Onboarding** : la page Paramètres permet d'uploader un logo, modifier des secrets WhatsApp. En démo, tous les boutons "Enregistrer" affichent un toast `"Désactivé en mode démo"` (override léger via le flag).

## Livraison en 2 étapes

1. **Étape 1 (ce tour)** : Mock Supabase + fixtures Restaurant + DemoContext + routes `/demo` et `/demo/restaurant/*` complètes. Validation visuelle sur les 8 pages avec le secteur Restaurant.
2. **Étape 2 (tour suivant)** : Fixtures pour les 4 autres secteurs, ajustements UI selon ce qu'on découvre.

Cette découpe limite le risque : si le mock Supabase ne couvre pas un cas, on le voit sur 1 secteur avant de l'étendre.
