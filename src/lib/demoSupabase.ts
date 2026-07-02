// src/lib/demoSupabase.ts
// Mock Supabase client used in demo mode. Implements the query/auth/storage
// surface used by the existing pages so they can render with fake data
// without any real backend call.

import { getFixtures, type DemoSector } from "./demoFixtures";


// ───── sector_configs mock (global, not per-company) ────────────────────────
const SECTOR_CONFIGS: Record<string, any> = {
  restaurant: {
    sector: "restaurant", label: "Restaurant", icon: "UtensilsCrossed", color: "#FF6B35",
    entity_table: "orders", entity_label: "Commande", entity_label_plural: "Commandes",
    crm_nav_label: "Commandes & clients", title_field: "client_name", subtitle_field: "items_summary",
    date_field: "created_at", status_field: "status",
    kpis: [
      { key: "active_orders", label: "Commandes actives" },
      { key: "ca_today", label: "CA du jour" },
      { key: "pending_orders", label: "En attente" },
    ],
    catalogue_table: "menu_items", catalogue_label: "Plat", catalogue_title_field: "name",
    catalogue_desc_field: "description", catalogue_price_field: "price",
  },
  real_estate: {
    sector: "real_estate", label: "Immobilier", icon: "Building2", color: "#00C875",
    entity_table: "property_leads", entity_label: "Lead", entity_label_plural: "Leads",
    crm_nav_label: "Leads & pipeline", title_field: "client_name", subtitle_field: "property_type",
    date_field: "created_at", status_field: "status",
    kpis: [
      { key: "pipeline_leads", label: "Leads en pipeline" },
      { key: "visits_upcoming", label: "Visites à venir" },
      { key: "ca_month", label: "CA du mois" },
    ],
    catalogue_table: "properties", catalogue_label: "Bien", catalogue_title_field: "title",
    catalogue_desc_field: "description", catalogue_price_field: "price",
  },
  travel_agency: {
    sector: "travel_agency", label: "Agence de voyage", icon: "Plane", color: "#579BFC",
    entity_table: "trip_bookings", entity_label: "Réservation", entity_label_plural: "Réservations",
    crm_nav_label: "Réservations", title_field: "client_name", subtitle_field: "destination",
    date_field: "created_at", status_field: "status",
    kpis: [
      { key: "active_bookings", label: "Réservations actives" },
      { key: "departures_upcoming", label: "Départs à venir" },
      { key: "ca_month", label: "CA du mois" },
    ],
    catalogue_table: "trip_packages", catalogue_label: "Package", catalogue_title_field: "name",
    catalogue_desc_field: "description", catalogue_price_field: "base_price",
  },
  private_school: {
    sector: "private_school", label: "École privée", icon: "GraduationCap", color: "#A25DDC",
    entity_table: "students", entity_label: "Élève", entity_label_plural: "Élèves",
    crm_nav_label: "Élèves & inscriptions", title_field: "full_name", subtitle_field: "class_level",
    date_field: "created_at", status_field: "enrollment_status",
    kpis: [
      { key: "enrolled_students", label: "Élèves inscrits" },
      { key: "pending_enrollments", label: "Inscriptions en attente" },
      { key: "ca_month", label: "Frais collectés" },
    ],
    catalogue_table: "school_classes", catalogue_label: "Classe", catalogue_title_field: "name",
    catalogue_desc_field: "description", catalogue_price_field: "annual_fee",
  },
  private_clinic: {
    sector: "private_clinic", label: "Clinique", icon: "Stethoscope", color: "#E2445C",
    entity_table: "appointments", entity_label: "Rendez-vous", entity_label_plural: "Rendez-vous",
    crm_nav_label: "Rendez-vous & patients", title_field: "patient_name", subtitle_field: "doctor_name",
    date_field: "scheduled_at", status_field: "status",
    kpis: [
      { key: "appointments_today", label: "RDV aujourd'hui" },
      { key: "available_rooms", label: "Disponibilités" },
      { key: "ca_month", label: "CA du mois" },
    ],
    catalogue_table: "clinic_services", catalogue_label: "Service", catalogue_title_field: "name",
    catalogue_desc_field: "description", catalogue_price_field: "price",
  },
  hotel: {
    sector: "hotel", label: "Hôtellerie", icon: "Hotel", color: "#FF6B35",
    entity_table: "reservations", entity_label: "Réservation", entity_label_plural: "Réservations",
    crm_nav_label: "Réservations & chambres", title_field: "guest_name", subtitle_field: "room_type",
    date_field: "check_in_date", status_field: "status",
    kpis: [
      { key: "occupied_rooms", label: "Chambres occupées" },
      { key: "checkins_today", label: "Check-ins aujourd'hui" },
      { key: "ca_month", label: "CA du mois" },
    ],
    catalogue_table: "room_types", catalogue_label: "Chambre", catalogue_title_field: "name",
    catalogue_desc_field: "description", catalogue_price_field: "price_per_night",
  },
  event: {
    sector: "event", label: "Événementiel", icon: "PartyPopper", color: "#F59E0B",
    entity_table: "events", entity_label: "Événement", entity_label_plural: "Événements",
    crm_nav_label: "Événements", title_field: "name", subtitle_field: "event_type",
    date_field: "event_date", status_field: "status",
    kpis: [
      { key: "events_month", label: "Événements ce mois" },
      { key: "ca_month", label: "CA du mois" },
      { key: "margin_avg", label: "Marge moyenne" },
    ],
    catalogue_table: "event_packages", catalogue_label: "Formule", catalogue_title_field: "name",
    catalogue_desc_field: "description", catalogue_price_field: "price_per_person",
  },
};

// Sector key mapping (demoKey → sector_configs key)
const DEMO_TO_SECTOR: Record<string, string> = {
  restaurant: "restaurant",
  real_estate: "real_estate",
  travel_agency: "travel_agency",
  private_school: "private_school",
  private_clinic: "private_clinic",
  hotel: "hotel",
  event: "event",
};

// ───── In-memory state per sector ───────────────────────────────────────────
// We clone fixtures so local mutations (insert/update/delete) stay within
// the session but don't bleed across sector switches.
const sessionState = new Map<DemoSector, Record<string, any[]>>();

function tableFor(sector: DemoSector, table: string): any[] {
  let state = sessionState.get(sector);
  if (!state) {
    state = JSON.parse(JSON.stringify(getFixtures(sector)));
    sessionState.set(sector, state!);
  }
  if (!state![table]) state![table] = [];
  return state![table];
}

export function resetDemoState(sector?: DemoSector) {
  if (sector) sessionState.delete(sector);
  else sessionState.clear();
}

// ───── Query builder ────────────────────────────────────────────────────────
type Filter = (row: any) => boolean;

function matchFilters(row: any, filters: Filter[]): boolean {
  return filters.every((f) => f(row));
}

function buildSelectResult(
  sector: DemoSector,
  table: string,
  filters: Filter[],
  opts: {
    orderBy?: { col: string; asc: boolean }[];
    limit?: number;
    range?: [number, number];
    head?: boolean;
    count?: "exact" | "planned" | "estimated";
  },
) {
  const all = tableFor(sector, table).filter((r) => matchFilters(r, filters));
  let sorted = all;
  if (opts.orderBy?.length) {
    sorted = [...all].sort((a, b) => {
      for (const o of opts.orderBy!) {
        const av = a[o.col];
        const bv = b[o.col];
        if (av === bv) continue;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av > bv ? 1 : -1;
        return o.asc ? cmp : -cmp;
      }
      return 0;
    });
  }
  let result = sorted;
  if (opts.range) result = result.slice(opts.range[0], opts.range[1] + 1);
  if (opts.limit != null) result = result.slice(0, opts.limit);
  return {
    data: opts.head ? null : result,
    count: opts.count ? all.length : null,
    error: null,
  };
}

class DemoQuery implements PromiseLike<any> {
  private filters: Filter[] = [];
  private orderBy: { col: string; asc: boolean }[] = [];
  private limitVal?: number;
  private rangeVal?: [number, number];
  private isSingle = false;
  private isMaybeSingle = false;
  private headOnly = false;
  private countMode?: "exact" | "planned" | "estimated";
  private mode: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: any = undefined;

  constructor(private sector: DemoSector, private table: string) {}

  // Filters
  eq(col: string, val: any) { this.filters.push((r) => r[col] === val); return this; }
  neq(col: string, val: any) { this.filters.push((r) => r[col] !== val); return this; }
  in(col: string, vals: any[]) { this.filters.push((r) => vals.includes(r[col])); return this; }
  gt(col: string, val: any) { this.filters.push((r) => r[col] > val); return this; }
  gte(col: string, val: any) { this.filters.push((r) => r[col] >= val); return this; }
  lt(col: string, val: any) { this.filters.push((r) => r[col] < val); return this; }
  lte(col: string, val: any) { this.filters.push((r) => r[col] <= val); return this; }
  is(col: string, val: any) { this.filters.push((r) => r[col] === val); return this; }
  not(col: string, op: string, val: any) {
    this.filters.push((r) => {
      const v = r[col];
      if (op === "eq") return v !== val;
      if (op === "is") return v !== val;
      if (op === "in") return !(val as any[]).includes(v);
      return true;
    });
    return this;
  }
  like(col: string, pattern: string) {
    const re = new RegExp("^" + pattern.replace(/%/g, ".*").replace(/_/g, ".") + "$", "i");
    this.filters.push((r) => typeof r[col] === "string" && re.test(r[col]));
    return this;
  }
  ilike(col: string, pattern: string) { return this.like(col, pattern); }
  or(_expr: string) { return this; } // best-effort: ignore complex or() filters
  contains(_col: string, _val: any) { return this; }
  match(filter: Record<string, any>) {
    for (const [k, v] of Object.entries(filter)) this.eq(k, v);
    return this;
  }

  // Modifiers
  order(col: string, opts?: { ascending?: boolean }) {
    this.orderBy.push({ col, asc: opts?.ascending !== false });
    return this;
  }
  range(from: number, to: number) { this.rangeVal = [from, to]; return this; }
  limit(n: number) { this.limitVal = n; return this; }
  single() { this.isSingle = true; return this; }
  maybeSingle() { this.isMaybeSingle = true; return this; }

  // Verbs
  select(_cols?: string, opts?: { count?: any; head?: boolean }) {
    this.mode = "select";
    if (opts?.head) this.headOnly = true;
    if (opts?.count) this.countMode = opts.count;
    return this;
  }
  insert(payload: any) { this.mode = "insert"; this.payload = payload; return this; }
  update(payload: any) { this.mode = "update"; this.payload = payload; return this; }
  upsert(payload: any, _opts?: any) { this.mode = "upsert"; this.payload = payload; return this; }
  delete() { this.mode = "delete"; return this; }

  // Execute
  private exec(): { data: any; error: any; count?: number | null } {
    const rows = tableFor(this.sector, this.table);

    if (this.mode === "insert" || this.mode === "upsert") {
      const items = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted = items.map((it) => ({ id: it.id ?? `demo-${Math.random().toString(36).slice(2, 10)}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...it }));
      rows.unshift(...inserted);
      const data = this.isSingle || this.isMaybeSingle ? inserted[0] : inserted;
      return { data, error: null };
    }

    if (this.mode === "update") {
      const targets = rows.filter((r) => matchFilters(r, this.filters));
      targets.forEach((r) => Object.assign(r, this.payload, { updated_at: new Date().toISOString() }));
      const data = this.isSingle || this.isMaybeSingle ? targets[0] ?? null : targets;
      return { data, error: null };
    }

    if (this.mode === "delete") {
      const keep: any[] = [];
      const removed: any[] = [];
      for (const r of rows) (matchFilters(r, this.filters) ? removed : keep).push(r);
      rows.length = 0;
      rows.push(...keep);
      return { data: removed, error: null };
    }

    // select
    // select
    const res = buildSelectResult(this.sector, this.table, this.filters, {
      orderBy: this.orderBy,
      limit: this.limitVal,
      range: this.rangeVal,
      head: this.headOnly,
      count: this.countMode,
    });
    if (this.isSingle || this.isMaybeSingle) {
      const list = (res.data as any[] | null) ?? [];
      const row = list[0] ?? null;
      if (this.table === "users" && row && !row.companies) {
        const allUsers = tableFor(this.sector, "users");
        const full = allUsers.find((u: any) => u.id === row.id);
        if (full?.companies) return { data: { ...row, companies: full.companies }, error: null };
      }
      return { data: row, error: null };
    }
    return { data: res.data, error: null, count: res.count };
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.exec()).then(onfulfilled, onrejected);
  }
}

function makeStorage() {
  const bucket = (_name: string) => ({
    upload: async (_path: string, _file: any, _opts?: any) => ({ data: { path: _path }, error: null }),
    getPublicUrl: (path: string) => ({ data: { publicUrl: `https://demo.local/${path}` } }),
    remove: async () => ({ data: null, error: null }),
    list: async () => ({ data: [], error: null }),
    download: async () => ({ data: null, error: null }),
  });
  return { from: bucket };
}

function makeAuth() {
  const session = {
    access_token: "demo-token",
    refresh_token: "demo-refresh",
    expires_at: Date.now() + 3600_000,
    user: { id: "demo-user", email: "demo@inspire-ia.com" },
  };
  return {
    getSession: async () => ({ data: { session }, error: null }),
    getUser: async () => ({ data: { user: session.user }, error: null }),
    signInWithPassword: async () => ({ data: { session }, error: null }),
    signUp: async () => ({ data: { session }, error: null }),
    signOut: async () => ({ error: null }),
    updateUser: async () => ({ data: { user: session.user }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    resetPasswordForEmail: async () => ({ data: null, error: null }),
  };
}

function makeChannel() {
  const ch: any = {
    on: () => ch,
    subscribe: () => ch,
    unsubscribe: () => ch,
    send: () => ch,
  };
  return ch;
}

// ───── Public factory ───────────────────────────────────────────────────────
export function createDemoClient(sector: DemoSector) {
  return {
    from: (table: string) => {
      if (table === "sector_configs") {
        // Return a special mock that handles .eq("sector", x).single()
        const sectorKey = DEMO_TO_SECTOR[sector] || sector;
        const configData = SECTOR_CONFIGS[sectorKey] || null;
        const mockQuery: any = {
          select: (_cols: string) => mockQuery,
          eq: (_col: string, _val: string) => mockQuery,
          single: async () => ({ data: configData, error: configData ? null : { message: "Not found" } }),
          maybeSingle: async () => ({ data: configData, error: null }),
          then: (resolve: any) => Promise.resolve({ data: configData ? [configData] : [], error: null }).then(resolve),
        };
        return mockQuery;
      }
      return new DemoQuery(sector, table);
    },
    auth: makeAuth(),
    storage: makeStorage(),
    channel: (_name: string) => makeChannel(),
    removeChannel: (_ch: any) => {},
    rpc: async (fn: string, _params?: any) => {
      if (fn === "get_sector_stats") {
        // Return mock KPI stats for the demo sector
        return { data: {
          active_orders: 12, ca_today: 185000, pending_orders: 3,
          pipeline_leads: 8, visits_upcoming: 4, ca_month: 2400000,
          active_bookings: 6, departures_upcoming: 2,
          enrolled_students: 247, pending_enrollments: 12,
          appointments_today: 18, available_rooms: 5,
          occupied_rooms: 22, checkins_today: 4,
          events_month: 7, margin_avg: 38,
          total_clients: 10,
        }, error: null };
      }
      return { data: null, error: null };
    },
  };
}