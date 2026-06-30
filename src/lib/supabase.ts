// src/lib/supabase.ts
// Real Supabase client + a runtime swap to a demo client when the app
// renders inside a DemoProvider subtree. The swap is driven by a global
// flag toggled by DemoProvider.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { createDemoClient } from "./demoSupabase";
import type { DemoSector } from "./demoFixtures";

const SUPABASE_URL = "https://gslnfmneleiurwunheku.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbG5mbW5lbGVpdXJ3dW5oZWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTU1NDIsImV4cCI6MjA5Mjg5MTU0Mn0.JLwwYUSRv9I2gkorLJmOGEf8468I8OrGpaeQwIwkF-I";

const realClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
  },
});

type DemoState = { active: boolean; sector: DemoSector };
const DEMO_KEY = "inspire-demo-mode";

function readPersisted(): DemoState {
  if (typeof window === "undefined") return { active: false, sector: "restaurant" };
  try {
    const raw = window.sessionStorage.getItem(DEMO_KEY);
    if (!raw) return { active: false, sector: "restaurant" };
    const p = JSON.parse(raw);
    return { active: !!p.active, sector: p.sector || "restaurant" };
  } catch { return { active: false, sector: "restaurant" }; }
}

const demoState: DemoState = readPersisted();
const demoClients = new Map<DemoSector, ReturnType<typeof createDemoClient>>();

export function setDemoMode(active: boolean, sector?: DemoSector) {
  demoState.active = active;
  if (sector) demoState.sector = sector;
  if (typeof window !== "undefined") {
    if (active) window.sessionStorage.setItem(DEMO_KEY, JSON.stringify(demoState));
    else window.sessionStorage.removeItem(DEMO_KEY);
  }
}

export function isDemoMode() { return demoState.active; }
export function getDemoSector(): DemoSector { return demoState.sector; }

function getActive(): any {
  if (!demoState.active) return realClient;
  let c = demoClients.get(demoState.sector);
  if (!c) { c = createDemoClient(demoState.sector); demoClients.set(demoState.sector, c); }
  return c;
}

// Proxy that forwards every property/method access to the active client.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    const c = getActive();
    const v = c[prop as any];
    return typeof v === "function" ? v.bind(c) : v;
  },
});
