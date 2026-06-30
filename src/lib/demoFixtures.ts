// src/lib/demoFixtures.ts
// Fake data per sector. Tables match what the existing pages query.
// Keep rows small but realistic so dashboards, charts and lists feel alive.

export type DemoSector = "restaurant" | "real_estate" | "travel_agency" | "private_school" | "private_clinic" | "hotel" | "event";

const COMPANY_ID = "demo-company";
const USER_ID = "demo-user";
const today = new Date();
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return d; };
const hoursAgo = (n: number) => { const d = new Date(today); d.setHours(d.getHours() - n); return d; };
const dateStr = (n = 0) => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

// ───── Common fixtures (per sector with different sector value) ─────────────
function commonFor(sector: DemoSector, companyName: string, logo: string, whatsapp: string): Record<string, any[]> {
  return {
    companies: [{
      id: COMPANY_ID, name: companyName, sector, status: "active",
      country: "Sénégal", city: "Dakar", phone: whatsapp, email: "contact@demo.local",
      website: "https://demo.inspire-ia.com", logo_url: logo, whatsapp_number: whatsapp,
      whatsapp_phone_number_id: "demo-wa-id", onboarding_completed: true,
      settings: { currency: "XOF", timezone: "Africa/Dakar" },
    }],
    users: [
      { id: USER_ID, email: "demo@inspire-ia.com", full_name: "Démo Inspire", role: "owner",
        company_id: COMPANY_ID, avatar_url: null,
        companies: { name: companyName, sector, status: "active", logo_url: logo, whatsapp_number: whatsapp, onboarding_completed: true, settings: {} } },
      { id: "demo-u2", email: "fatou@demo.local", full_name: "Fatou Sow", role: "admin", company_id: COMPANY_ID, avatar_url: null, created_at: iso(daysAgo(45)) },
      { id: "demo-u3", email: "moussa@demo.local", full_name: "Moussa Traoré", role: "member", company_id: COMPANY_ID, avatar_url: null, created_at: iso(daysAgo(20)) },
      { id: "demo-u4", email: "aissatou@demo.local", full_name: "Aïssatou Ba", role: "member", company_id: COMPANY_ID, avatar_url: null, created_at: iso(daysAgo(7)) },
    ],
    chatbots: [{
      id: "demo-bot", company_id: COMPANY_ID, channel: "whatsapp", is_active: true,
      welcome_message: "Bonjour 👋 Bienvenue chez " + companyName + " ! Comment puis-je vous aider ?",
      ai_instructions: "Tu es un assistant chaleureux et efficace.",
      model: "gpt-4o-mini", temperature: 0.7,
    }],
    company_secrets: [{ company_id: COMPANY_ID, whatsapp_access_token: "demo-token-redacted" }],
    clients: [
      { id: "c1", company_id: COMPANY_ID, full_name: "Aïcha Diop",     phone: "+221 77 123 45 67", email: "aicha@example.com",  created_at: iso(daysAgo(35)), tags: ["VIP"],     notes: "Cliente fidèle" },
      { id: "c2", company_id: COMPANY_ID, full_name: "Moussa Sarr",    phone: "+221 77 234 56 78", email: "moussa@example.com", created_at: iso(daysAgo(28)), tags: [],          notes: "" },
      { id: "c3", company_id: COMPANY_ID, full_name: "Fatou Ndiaye",   phone: "+221 78 345 67 89", email: "fatou@example.com",  created_at: iso(daysAgo(21)), tags: ["Nouveau"], notes: "" },
      { id: "c4", company_id: COMPANY_ID, full_name: "Jean Kouassi",   phone: "+225 07 456 78 90", email: "jean@example.com",   created_at: iso(daysAgo(14)), tags: [],          notes: "Préfère le matin" },
      { id: "c5", company_id: COMPANY_ID, full_name: "Awa Sow",        phone: "+221 76 567 89 01", email: "awa@example.com",    created_at: iso(daysAgo(10)), tags: ["VIP"],     notes: "" },
      { id: "c6", company_id: COMPANY_ID, full_name: "Ibrahim Bah",    phone: "+221 77 678 90 12", email: "ibrahim@example.com",created_at: iso(daysAgo(7)),  tags: [],          notes: "" },
      { id: "c7", company_id: COMPANY_ID, full_name: "Mariam Cissé",   phone: "+221 78 789 01 23", email: "mariam@example.com", created_at: iso(daysAgo(5)),  tags: ["Nouveau"], notes: "" },
      { id: "c8", company_id: COMPANY_ID, full_name: "Pierre Diallo",  phone: "+221 77 890 12 34", email: "pierre@example.com", created_at: iso(daysAgo(3)),  tags: [],          notes: "" },
      { id: "c9", company_id: COMPANY_ID, full_name: "Aminata Faye",   phone: "+221 76 901 23 45", email: "aminata@example.com",created_at: iso(daysAgo(2)),  tags: [],          notes: "" },
      { id: "c10",company_id: COMPANY_ID, full_name: "Cheikh Mbaye",   phone: "+221 77 012 34 56", email: "cheikh@example.com", created_at: iso(daysAgo(1)),  tags: ["Nouveau"], notes: "" },
    ],
    chat_sessions: [
      { id: "s1", company_id: COMPANY_ID, client_id: "c1", client_name: "Aïcha Diop",   client_phone: "+221 77 123 45 67", last_message_at: iso(hoursAgo(0.3)), status: "active",   created_at: iso(daysAgo(5)) },
      { id: "s2", company_id: COMPANY_ID, client_id: "c2", client_name: "Moussa Sarr",  client_phone: "+221 77 234 56 78", last_message_at: iso(hoursAgo(1.2)), status: "active",   created_at: iso(daysAgo(3)) },
      { id: "s3", company_id: COMPANY_ID, client_id: "c3", client_name: "Fatou Ndiaye", client_phone: "+221 78 345 67 89", last_message_at: iso(hoursAgo(3)),   status: "active",   created_at: iso(daysAgo(2)) },
      { id: "s4", company_id: COMPANY_ID, client_id: "c4", client_name: "Jean Kouassi", client_phone: "+225 07 456 78 90", last_message_at: iso(hoursAgo(6)),   status: "pending",  created_at: iso(daysAgo(2)) },
      { id: "s5", company_id: COMPANY_ID, client_id: "c5", client_name: "Awa Sow",      client_phone: "+221 76 567 89 01", last_message_at: iso(hoursAgo(20)),  status: "resolved", created_at: iso(daysAgo(4)) },
      { id: "s6", company_id: COMPANY_ID, client_id: "c6", client_name: "Ibrahim Bah",  client_phone: "+221 77 678 90 12", last_message_at: iso(daysAgo(1)),    status: "resolved", created_at: iso(daysAgo(5)) },
    ],
    chat_messages: [
      { id: "m1", company_id: COMPANY_ID, session_id: "s1", direction: "inbound",  content: "Bonjour, j'aimerais des informations s'il vous plaît.", created_at: iso(hoursAgo(0.5)) },
      { id: "m2", company_id: COMPANY_ID, session_id: "s1", direction: "outbound", content: "Bonsoir 👋 Avec plaisir, que cherchez-vous ?",          created_at: iso(hoursAgo(0.4)) },
      { id: "m3", company_id: COMPANY_ID, session_id: "s1", direction: "inbound",  content: "Vos prix svp.",                                           created_at: iso(hoursAgo(0.3)) },
      { id: "m4", company_id: COMPANY_ID, session_id: "s2", direction: "inbound",  content: "Bonjour !",                                               created_at: iso(hoursAgo(1.3)) },
      { id: "m5", company_id: COMPANY_ID, session_id: "s2", direction: "outbound", content: "Bonjour Moussa, comment puis-je vous aider ?",            created_at: iso(hoursAgo(1.2)) },
      { id: "m6", company_id: COMPANY_ID, session_id: "s3", direction: "inbound",  content: "Vous êtes ouverts demain ?",                              created_at: iso(hoursAgo(3.1)) },
      { id: "m7", company_id: COMPANY_ID, session_id: "s3", direction: "outbound", content: "Oui, de 9h à 22h.",                                       created_at: iso(hoursAgo(3)) },
    ],
  };
}

// ───── Restaurant ───────────────────────────────────────────────────────────
const restaurantOrders = [
  { id: "o1",  company_id: COMPANY_ID, client_id: "c1", client_name: "Aïcha Diop",    total_amount: 14500, status: "pending",    payment_status: "pending", channel: "whatsapp", created_at: iso(hoursAgo(0.5)), items: [{name:"Poulet braisé",qty:2,price:5500},{name:"Salade",qty:1,price:3500}] },
  { id: "o2",  company_id: COMPANY_ID, client_id: "c2", client_name: "Moussa Sarr",   total_amount: 9800,  status: "preparing",  payment_status: "paid",    channel: "whatsapp", created_at: iso(hoursAgo(1)),   items: [{name:"Thieboudienne",qty:1,price:7000},{name:"Bissap",qty:2,price:1400}] },
  { id: "o3",  company_id: COMPANY_ID, client_id: "c3", client_name: "Fatou Ndiaye",  total_amount: 13500, status: "preparing",  payment_status: "paid",    channel: "whatsapp", created_at: iso(hoursAgo(1.5)), items: [{name:"Yassa poulet",qty:3,price:4500}] },
  { id: "o4",  company_id: COMPANY_ID, client_id: "c4", client_name: "Jean Kouassi",  total_amount: 6200,  status: "ready",      payment_status: "paid",    channel: "whatsapp", created_at: iso(hoursAgo(2)),   items: [{name:"Mafé bœuf",qty:1,price:5000},{name:"Jus gingembre",qty:1,price:1200}] },
  { id: "o5",  company_id: COMPANY_ID, client_id: "c5", client_name: "Awa Sow",       total_amount: 3400,  status: "delivered",  payment_status: "paid",    channel: "whatsapp", created_at: iso(hoursAgo(3)),   items: [{name:"Pastels",qty:2,price:1200},{name:"Café",qty:1,price:1000}] },
  { id: "o6",  company_id: COMPANY_ID, client_id: "c6", client_name: "Ibrahim Bah",   total_amount: 7800,  status: "delivered",  payment_status: "paid",    channel: "whatsapp", created_at: iso(hoursAgo(5)),   items: [{name:"Poulet DG",qty:1,price:6800},{name:"Coca",qty:1,price:1000}] },
  { id: "o7",  company_id: COMPANY_ID, client_id: "c1", client_name: "Aïcha Diop",    total_amount: 11000, status: "delivered",  payment_status: "paid",    channel: "whatsapp", created_at: iso(daysAgo(1)),    items: [{name:"Tajine",qty:1,price:9000},{name:"Eau",qty:2,price:1000}] },
  { id: "o8",  company_id: COMPANY_ID, client_id: "c7", client_name: "Mariam Cissé",  total_amount: 15600, status: "delivered",  payment_status: "paid",    channel: "instagram",created_at: iso(daysAgo(1)),    items: [] },
  { id: "o9",  company_id: COMPANY_ID, client_id: "c8", client_name: "Pierre Diallo", total_amount: 4500,  status: "cancelled",  payment_status: "refunded",channel: "whatsapp", created_at: iso(daysAgo(2)),    items: [] },
  { id: "o10", company_id: COMPANY_ID, client_id: "c9", client_name: "Aminata Faye",  total_amount: 8900,  status: "delivered",  payment_status: "paid",    channel: "whatsapp", created_at: iso(daysAgo(2)),    items: [] },
  { id: "o11", company_id: COMPANY_ID, client_id: "c10",client_name: "Cheikh Mbaye",  total_amount: 6500,  status: "delivered",  payment_status: "paid",    channel: "whatsapp", created_at: iso(daysAgo(3)),    items: [] },
  { id: "o12", company_id: COMPANY_ID, client_id: "c2", client_name: "Moussa Sarr",   total_amount: 12000, status: "delivered",  payment_status: "paid",    channel: "whatsapp", created_at: iso(daysAgo(4)),    items: [] },
];

const restaurantMenu = [
  { id: "m1", company_id: COMPANY_ID, name: "Poulet braisé",  category: "Plat",    price: 5500, description: "Poulet mariné braisé au charbon",  is_available: true,  image_url: null },
  { id: "m2", company_id: COMPANY_ID, name: "Thieboudienne",  category: "Plat",    price: 7000, description: "Riz au poisson, légumes du jour",  is_available: true,  image_url: null },
  { id: "m3", company_id: COMPANY_ID, name: "Yassa poulet",   category: "Plat",    price: 4500, description: "Poulet à l'oignon et citron",      is_available: true,  image_url: null },
  { id: "m4", company_id: COMPANY_ID, name: "Mafé bœuf",      category: "Plat",    price: 5000, description: "Sauce d'arachide, riz blanc",      is_available: true,  image_url: null },
  { id: "m5", company_id: COMPANY_ID, name: "Tajine d'agneau",category: "Plat",    price: 9000, description: "Agneau confit, légumes",           is_available: true,  image_url: null },
  { id: "m6", company_id: COMPANY_ID, name: "Salade fraîcheur",category:"Entrée",  price: 3500, description: "Crudités et vinaigrette maison",   is_available: true,  image_url: null },
  { id: "m7", company_id: COMPANY_ID, name: "Pastels",        category: "Entrée",  price: 1200, description: "Pâte feuilletée garnie",           is_available: true,  image_url: null },
  { id: "m8", company_id: COMPANY_ID, name: "Bissap",         category: "Boisson", price: 700,  description: "Infusion d'hibiscus",              is_available: true,  image_url: null },
  { id: "m9", company_id: COMPANY_ID, name: "Jus gingembre",  category: "Boisson", price: 1200, description: "Jus frais de gingembre",           is_available: true,  image_url: null },
];

// ───── Real Estate ──────────────────────────────────────────────────────────
const properties = [
  { id: "p1", company_id: COMPANY_ID, title: "Appartement 3P — Almadies",  type: "apartment", price: 95_000_000, surface: 110, bedrooms: 3, bathrooms: 2, city: "Dakar", neighborhood: "Almadies",  status: "available", listing_type: "sale", image_url: null, created_at: iso(daysAgo(40)) },
  { id: "p2", company_id: COMPANY_ID, title: "Villa moderne — Ngor",       type: "villa",     price: 320_000_000,surface: 280, bedrooms: 5, bathrooms: 4, city: "Dakar", neighborhood: "Ngor",      status: "available", listing_type: "sale", image_url: null, created_at: iso(daysAgo(28)) },
  { id: "p3", company_id: COMPANY_ID, title: "Studio meublé — Plateau",    type: "apartment", price: 450_000,    surface: 35,  bedrooms: 1, bathrooms: 1, city: "Dakar", neighborhood: "Plateau",   status: "available", listing_type: "rent", image_url: null, created_at: iso(daysAgo(18)) },
  { id: "p4", company_id: COMPANY_ID, title: "Maison 4 pièces — Mermoz",   type: "house",     price: 180_000_000,surface: 200, bedrooms: 4, bathrooms: 3, city: "Dakar", neighborhood: "Mermoz",    status: "reserved",  listing_type: "sale", image_url: null, created_at: iso(daysAgo(15)) },
  { id: "p5", company_id: COMPANY_ID, title: "Bureaux — Sacré-Cœur",       type: "office",    price: 1_200_000,  surface: 150, bedrooms: 0, bathrooms: 2, city: "Dakar", neighborhood: "Sacré-Cœur", status: "available", listing_type: "rent", image_url: null, created_at: iso(daysAgo(10)) },
  { id: "p6", company_id: COMPANY_ID, title: "Terrain 500m² — Saly",       type: "land",      price: 45_000_000, surface: 500, bedrooms: 0, bathrooms: 0, city: "Mbour", neighborhood: "Saly",      status: "available", listing_type: "sale", image_url: null, created_at: iso(daysAgo(5)) },
];

const propertyLeads = [
  { id: "l1", company_id: COMPANY_ID, client_id: "c1", client_name: "Aïcha Diop",    property_id: "p2", lead_type: "buyer", budget_min: 250_000_000, budget_max: 350_000_000, pipeline_stage: "new",        created_at: iso(daysAgo(2)),  notes: "Cherche villa familiale" },
  { id: "l2", company_id: COMPANY_ID, client_id: "c2", client_name: "Moussa Sarr",   property_id: "p1", lead_type: "buyer", budget_min: 80_000_000,  budget_max: 100_000_000, pipeline_stage: "contacted",  created_at: iso(daysAgo(5)),  notes: "Visite prévue" },
  { id: "l3", company_id: COMPANY_ID, client_id: "c3", client_name: "Fatou Ndiaye",  property_id: "p3", lead_type: "tenant",budget_min: 400_000,     budget_max: 500_000,     pipeline_stage: "visit",      created_at: iso(daysAgo(7)),  notes: "Disponible immédiatement" },
  { id: "l4", company_id: COMPANY_ID, client_id: "c4", client_name: "Jean Kouassi",  property_id: "p4", lead_type: "buyer", budget_min: 150_000_000, budget_max: 200_000_000, pipeline_stage: "negotiation",created_at: iso(daysAgo(10)), notes: "Offre en cours" },
  { id: "l5", company_id: COMPANY_ID, client_id: "c5", client_name: "Awa Sow",       property_id: "p6", lead_type: "buyer", budget_min: 40_000_000,  budget_max: 50_000_000,  pipeline_stage: "won",        created_at: iso(daysAgo(14)), notes: "Vente conclue" },
  { id: "l6", company_id: COMPANY_ID, client_id: "c6", client_name: "Ibrahim Bah",   property_id: "p1", lead_type: "buyer", budget_min: 90_000_000,  budget_max: 110_000_000, pipeline_stage: "new",        created_at: iso(daysAgo(1)),  notes: "" },
  { id: "l7", company_id: COMPANY_ID, client_id: "c7", client_name: "Mariam Cissé",  property_id: "p5", lead_type: "tenant",budget_min: 1_000_000,   budget_max: 1_500_000,   pipeline_stage: "contacted",  created_at: iso(daysAgo(3)),  notes: "Bureau pour cabinet" },
];

// ───── Travel ───────────────────────────────────────────────────────────────
const tripPackages = [
  { id: "tp1", company_id: COMPANY_ID, name: "Maroc Essentiel 7j",   destination: "Marrakech", duration_days: 7,  price_per_person: 450_000,  is_available: true, image_url: null, description: "Visite culturelle Marrakech & Fès" },
  { id: "tp2", company_id: COMPANY_ID, name: "Maroc Prestige 10j",   destination: "Marrakech", duration_days: 10, price_per_person: 720_000,  is_available: true, image_url: null, description: "Riads de luxe et désert" },
  { id: "tp3", company_id: COMPANY_ID, name: "Dubaï Découverte 5j",  destination: "Dubaï",     duration_days: 5,  price_per_person: 850_000,  is_available: true, image_url: null, description: "Burj Khalifa, désert, plages" },
  { id: "tp4", company_id: COMPANY_ID, name: "Turquie 8j",            destination: "Istanbul",  duration_days: 8,  price_per_person: 620_000,  is_available: true, image_url: null, description: "Istanbul & Cappadoce" },
  { id: "tp5", company_id: COMPANY_ID, name: "Cap-Vert 6j",           destination: "Sal",       duration_days: 6,  price_per_person: 380_000,  is_available: true, image_url: null, description: "Plages et farniente" },
  { id: "tp6", company_id: COMPANY_ID, name: "Omra 12j",              destination: "Médine",    duration_days: 12, price_per_person: 1_400_000,is_available: true, image_url: null, description: "Pèlerinage complet" },
];

const tripBookings = [
  { id: "tb1", company_id: COMPANY_ID, client_id: "c1", client_name: "Aïcha Diop",    package_id: "tp2", departure_date: dateStr(15), people: 2, total_amount: 1_440_000, deposit_amount: 500_000, status: "confirmed",   created_at: iso(daysAgo(3)) },
  { id: "tb2", company_id: COMPANY_ID, client_id: "c2", client_name: "Moussa Sarr",   package_id: "tp3", departure_date: dateStr(8),  people: 1, total_amount: 850_000,   deposit_amount: 300_000, status: "deposit_paid",created_at: iso(daysAgo(5)) },
  { id: "tb3", company_id: COMPANY_ID, client_id: "c3", client_name: "Fatou Ndiaye",  package_id: "tp1", departure_date: dateStr(22), people: 3, total_amount: 1_350_000, deposit_amount: 1_350_000,status: "fully_paid",  created_at: iso(daysAgo(7)) },
  { id: "tb4", company_id: COMPANY_ID, client_id: "c4", client_name: "Jean Kouassi",  package_id: "tp4", departure_date: dateStr(40), people: 2, total_amount: 1_240_000, deposit_amount: 400_000, status: "pending",     created_at: iso(daysAgo(1)) },
  { id: "tb5", company_id: COMPANY_ID, client_id: "c5", client_name: "Awa Sow",       package_id: "tp6", departure_date: dateStr(60), people: 1, total_amount: 1_400_000, deposit_amount: 700_000, status: "deposit_paid",created_at: iso(daysAgo(10)) },
  { id: "tb6", company_id: COMPANY_ID, client_id: "c6", client_name: "Ibrahim Bah",   package_id: "tp5", departure_date: dateStr(-15),people: 2, total_amount: 760_000,   deposit_amount: 760_000, status: "completed",   created_at: iso(daysAgo(45)) },
  { id: "tb7", company_id: COMPANY_ID, client_id: "c7", client_name: "Mariam Cissé",  package_id: "tp3", departure_date: dateStr(-30),people: 4, total_amount: 3_400_000, deposit_amount: 3_400_000,status: "completed",   created_at: iso(daysAgo(60)) },
];

// ───── School ───────────────────────────────────────────────────────────────
const schoolClasses = [
  { id: "cl1", company_id: COMPANY_ID, name: "CP A",   level: "CP",   current_count: 24, capacity: 30 },
  { id: "cl2", company_id: COMPANY_ID, name: "CE1 B",  level: "CE1",  current_count: 28, capacity: 30 },
  { id: "cl3", company_id: COMPANY_ID, name: "CE2 A",  level: "CE2",  current_count: 22, capacity: 28 },
  { id: "cl4", company_id: COMPANY_ID, name: "CM1 B",  level: "CM1",  current_count: 26, capacity: 30 },
  { id: "cl5", company_id: COMPANY_ID, name: "CM2 A",  level: "CM2",  current_count: 19, capacity: 25 },
  { id: "cl6", company_id: COMPANY_ID, name: "6ème 1", level: "6ème", current_count: 30, capacity: 32 },
];

const students = Array.from({ length: 32 }, (_, i) => ({
  id: `st${i+1}`, company_id: COMPANY_ID,
  first_name: ["Awa","Moussa","Fatou","Cheikh","Mariam","Ibrahim","Aïcha","Jean","Pierre","Aminata","Khady","Lamine"][i%12],
  last_name:  ["Diop","Sarr","Ndiaye","Kouassi","Sow","Bah","Cissé","Diallo","Faye","Mbaye","Ba","Sy"][i%12],
  class_id: schoolClasses[i % schoolClasses.length].id,
  level: schoolClasses[i % schoolClasses.length].level,
  parent_name: "Parent " + (i+1), parent_phone: "+221 77 " + (100+i) + " 00 " + (10+i),
  status: i < 28 ? "active" : "alumni",
  created_at: iso(daysAgo(60 + (i % 30))),
}));

const grades = Array.from({ length: 60 }, (_, i) => ({
  id: `g${i+1}`, company_id: COMPANY_ID,
  student_id: students[i % students.length].id,
  subject: ["Maths","Français","Histoire","Anglais","Sciences"][i % 5],
  grade: Math.round(8 + Math.random() * 11),
  max_grade: 20,
  created_at: iso(daysAgo(i % 30)),
}));

const absences = Array.from({ length: 18 }, (_, i) => ({
  id: `ab${i+1}`, company_id: COMPANY_ID,
  student_id: students[i].id,
  absence_date: dateStr(-(i % 25)),
  is_justified: i % 3 !== 0,
}));

// ───── Clinic ───────────────────────────────────────────────────────────────
const clinicServices = [
  { id: "sv1", company_id: COMPANY_ID, name: "Consultation généraliste", duration_min: 30, price: 15_000, description: "Consultation standard", is_available: true, image_url: null },
  { id: "sv2", company_id: COMPANY_ID, name: "Pédiatrie",                duration_min: 30, price: 20_000, description: "Suivi enfant",         is_available: true, image_url: null },
  { id: "sv3", company_id: COMPANY_ID, name: "Cardiologie",              duration_min: 45, price: 35_000, description: "Bilan cardiaque",      is_available: true, image_url: null },
  { id: "sv4", company_id: COMPANY_ID, name: "Dermatologie",             duration_min: 30, price: 25_000, description: "Consultation peau",    is_available: true, image_url: null },
  { id: "sv5", company_id: COMPANY_ID, name: "Échographie",              duration_min: 30, price: 30_000, description: "Imagerie",             is_available: true, image_url: null },
];

const appointments = [
  { id: "ap1", company_id: COMPANY_ID, client_id: "c1", client_name: "Aïcha Diop",    service_id: "sv2", doctor: "Dr Koné",    appointment_date: dateStr(0),  appointment_time: "10:00", status: "confirmed", created_at: iso(daysAgo(2)) },
  { id: "ap2", company_id: COMPANY_ID, client_id: "c2", client_name: "Moussa Sarr",   service_id: "sv1", doctor: "Dr Diallo",  appointment_date: dateStr(0),  appointment_time: "11:30", status: "confirmed", created_at: iso(daysAgo(1)) },
  { id: "ap3", company_id: COMPANY_ID, client_id: "c3", client_name: "Fatou Ndiaye",  service_id: "sv3", doctor: "Dr Faye",    appointment_date: dateStr(0),  appointment_time: "14:00", status: "confirmed", created_at: iso(daysAgo(3)) },
  { id: "ap4", company_id: COMPANY_ID, client_id: "c4", client_name: "Jean Kouassi",  service_id: "sv1", doctor: "Dr Diallo",  appointment_date: dateStr(1),  appointment_time: "09:30", status: "confirmed", created_at: iso(daysAgo(1)) },
  { id: "ap5", company_id: COMPANY_ID, client_id: "c5", client_name: "Awa Sow",       service_id: "sv4", doctor: "Dr Mbaye",   appointment_date: dateStr(1),  appointment_time: "15:00", status: "pending",   created_at: iso(daysAgo(0)) },
  { id: "ap6", company_id: COMPANY_ID, client_id: "c6", client_name: "Ibrahim Bah",   service_id: "sv2", doctor: "Dr Koné",    appointment_date: dateStr(2),  appointment_time: "10:30", status: "confirmed", created_at: iso(daysAgo(2)) },
  { id: "ap7", company_id: COMPANY_ID, client_id: "c7", client_name: "Mariam Cissé",  service_id: "sv5", doctor: "Dr Sy",      appointment_date: dateStr(-2), appointment_time: "16:00", status: "completed", created_at: iso(daysAgo(5)) },
  { id: "ap8", company_id: COMPANY_ID, client_id: "c8", client_name: "Pierre Diallo", service_id: "sv1", doctor: "Dr Diallo",  appointment_date: dateStr(-3), appointment_time: "11:00", status: "completed", created_at: iso(daysAgo(6)) },
];

// ───── Build per-sector bundles ─────────────────────────────────────────────
const FIXTURES: Record<DemoSector, Record<string, any[]>> = {
  restaurant: {
    ...commonFor("restaurant", "Restaurant Le Baobab", "https://api.dicebear.com/9.x/initials/svg?seed=LB&backgroundColor=ff6b35", "+221 77 100 00 01"),
    orders: restaurantOrders,
    menu_items: restaurantMenu,
  },
  real_estate: {
    ...commonFor("real_estate", "Sénégal Immo", "https://api.dicebear.com/9.x/initials/svg?seed=SI&backgroundColor=00c875", "+221 77 100 00 02"),
    properties,
    property_leads: propertyLeads,
  },
  travel_agency: {
    ...commonFor("travel_agency", "Évasion Voyages", "https://api.dicebear.com/9.x/initials/svg?seed=EV&backgroundColor=579bfc", "+221 77 100 00 03"),
    trip_packages: tripPackages,
    trip_bookings: tripBookings,
  },
  private_school: {
    ...commonFor("private_school", "École La Réussite", "https://api.dicebear.com/9.x/initials/svg?seed=ER&backgroundColor=a25ddc", "+221 77 100 00 04"),
    students,
    school_classes: schoolClasses,
    grades,
    absences,
  },
  private_clinic: {
    ...commonFor("private_clinic", "Clinique Lumière", "https://api.dicebear.com/9.x/initials/svg?seed=CL&backgroundColor=e2445c", "+221 77 100 00 05"),
    appointments,
    clinic_services: clinicServices,
  },
  hotel: {
    ...commonFor("hotel", "Hôtel Téranga", "https://api.dicebear.com/9.x/initials/svg?seed=HT&backgroundColor=ff6b35", "+221 77 100 00 06"),
  },
  event: {
    ...commonFor("event", "Inspire Event Panko", "https://api.dicebear.com/9.x/initials/svg?seed=EP&backgroundColor=f59e0b", "+221 77 100 00 07"),
  },
};

export function getFixtures(sector: DemoSector) {
  return FIXTURES[sector];
}

export function getDemoCompany(sector: DemoSector) {
  return FIXTURES[sector].companies[0];
}
