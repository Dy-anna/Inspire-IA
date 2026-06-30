// src/lib/demoSupabase.ts
// Mock Supabase client used in demo mode. Implements the query/auth/storage
// surface used by the existing pages so they can render with fake data
// without any real backend call.

import { getFixtures, type DemoSector } from "./demoFixtures";

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
    const res = buildSelectResult(this.sector, this.table, this.filters, {
      orderBy: this.orderBy,
      limit: this.limitVal,
      range: this.rangeVal,
      head: this.headOnly,
      count: this.countMode,
    });
    if (this.isSingle || this.isMaybeSingle) {
      const list = (res.data as any[] | null) ?? [];
      return { data: list[0] ?? null, error: null };
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

// ───── Storage / Auth / Channel stubs ───────────────────────────────────────
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
    from: (table: string) => new DemoQuery(sector, table),
    auth: makeAuth(),
    storage: makeStorage(),
    channel: (_name: string) => makeChannel(),
    removeChannel: (_ch: any) => {},
    rpc: async (_fn: string, _params?: any) => ({ data: null, error: null }),
  };
}
