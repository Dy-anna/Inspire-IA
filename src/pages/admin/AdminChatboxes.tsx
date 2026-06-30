// src/pages/admin/AdminChatboxes.tsx
import { useState, useEffect, useCallback } from "react";
import { SectorIcon } from "@/components/SectorIcon";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { toast } from "sonner";
import { Search, X, MessageSquare, CheckCircle, XCircle, AlertTriangle, ChevronRight, RefreshCw, Zap } from "lucide-react";

const SECTOR_CFG: Record<string, { label: string; color: string; icon: string }> = {
  restaurant:     { label: "Restaurant",  color: "#B35000", icon: "UtensilsCrossed" },
  real_estate:    { label: "Immobilier",  color: "#1D7F42", icon: "Building2" },
  travel_agency:  { label: "Voyage",      color: "#0B6BCB", icon: "Plane" },
  private_clinic: { label: "Clinique",    color: "#C0392B", icon: "Stethoscope" },
  private_school: { label: "École",       color: "#6B3FA0", icon: "GraduationCap" },
  hotel:          { label: "Hôtellerie",   color: "#FF6B35", icon: "Hotel" },
  event:          { label: "Événementiel", color: "#F59E0B", icon: "PartyPopper" },
};

const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—";
const fmtRel = (iso: string | null) => {
  if (!iso) return "—";
  const d = Date.now() - new Date(iso).getTime();
  if (d < 3600000) return `${Math.floor(d / 60000)} min`;
  if (d < 86400000) return `${Math.floor(d / 3600000)} h`;
  return `${Math.floor(d / 86400000)} j`;
};

type CTab = "chatbots" | "learning";

export default function AdminChatboxes() {
  const [tab, setTab] = useState<CTab>("chatbots");
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [learningItems, setLearningItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [bots, learning] = await Promise.all([
      supabase.from("chatbots").select("*, companies(name, sector)").order("total_interactions", { ascending: false }).limit(100),
      supabase.from("chat_learning").select("*, companies(name)").eq("is_reviewed", false).order("created_at", { ascending: false }).limit(100),
    ]);

    const botsData = (bots.data || []).map((b: any) => ({
      ...b,
      company_name: b.companies?.name || "—",
      sector: b.companies?.sector || b.sector_template || "",
    }));
    setChatbots(botsData);
    setLearningItems((learning.data || []).map((l: any) => ({ ...l, company_name: l.companies?.name || "—" })));

    const totalInteractions = botsData.reduce((s: number, b: any) => s + (b.total_interactions || 0), 0);
    const totalEscalations = botsData.reduce((s: number, b: any) => s + (b.total_escalations || 0), 0);
    const activeBots = botsData.filter((b: any) => b.is_active).length;
    const escalateRate = totalInteractions > 0 ? Math.round((totalEscalations / totalInteractions) * 100) : 0;
    const unclassified = learning.data?.length || 0;
    setStats({ total: botsData.length, active: activeBots, totalInteractions, totalEscalations, escalateRate, unclassified });
    setLoading(false);
  };

  const toggleBot = async (bot: any) => {
    await supabase.from("chatbots").update({ is_active: !bot.is_active }).eq("id", bot.id);
    setChatbots(prev => prev.map(b => b.id === bot.id ? { ...b, is_active: !b.is_active } : b));
    toast.success(bot.is_active ? "Chatbot désactivé" : "Chatbot activé");
  };

  const reviewLearning = async (item: any, resolvedIntent: string) => {
    if (!resolvedIntent.trim()) { toast.error("Intent requis"); return; }
    await supabase.from("chat_learning").update({
      is_reviewed: true, resolved_intent: resolvedIntent, reviewed_at: new Date().toISOString(),
    }).eq("id", item.id);
    setLearningItems(prev => prev.filter(l => l.id !== item.id));
    toast.success("Message classifié ✓");
  };

  const filteredBots = chatbots.filter(b => !search || b.name?.toLowerCase().includes(search.toLowerCase()) || (b.company_name || "").toLowerCase().includes(search.toLowerCase()));

  const TABS = [
    { id: "chatbots" as CTab, label: `Chatbots (${chatbots.length})`, icon: MessageSquare },
    { id: "learning" as CTab, label: `Chat Learning (${learningItems.length})`, icon: Zap },
  ];

  return (
    <AdminLayout currentPath="/admin/chatboxes">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Chatboxes</h1>
          <p style={{ fontSize: 13, color: "#787774", margin: "4px 0 0" }}>Gestion IA & apprentissage</p>
        </div>
      </div>

      {/* KPIs */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Chatbots total",    value: stats.total,            color: "#0B6BCB" },
            { label: "Actifs",            value: stats.active,           color: "#1D7F42" },
            { label: "Interactions",      value: stats.totalInteractions, color: "#6B3FA0" },
            { label: "Taux d'escalade",   value: `${stats.escalateRate}%`,color: stats.escalateRate > 20 ? "#B91C1C" : "#B35000" },
            { label: "Non classifiés",    value: stats.unclassified,     color: stats.unclassified > 10 ? "#B91C1C" : "#787774" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: "14px 16px", borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#F7F7F5", padding: 4, borderRadius: 9, marginBottom: 20, width: "fit-content" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 16px", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: tab === id ? "#fff" : "transparent", color: tab === id ? "#1A1A1A" : "#787774", boxShadow: tab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* ── CHATBOTS ── */}
      {tab === "chatbots" && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, padding: "8px 12px", maxWidth: 300 }}>
              <Search size={13} color="#AFAFAC" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chatbot, entreprise..."
                style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", flex: 1, background: "transparent" }} />
            </div>
          </div>
          {loading
            ? <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredBots.map(bot => {
                  const sec = SECTOR_CFG[bot.sector] || { icon: "Bot", color: "#787774", label: bot.sector };
                  const escRate = bot.total_interactions > 0 ? Math.round((bot.total_escalations / bot.total_interactions) * 100) : 0;
                  return (
                    <div key={bot.id} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${sec.color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}><SectorIcon name={sec.icon} size={20} color={sec.color} /></div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{bot.name}</div>
                            <div style={{ fontSize: 12, color: "#787774" }}>{bot.company_name} · {sec.label} · {bot.channel || "WhatsApp"}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ background: bot.is_active ? "#F0FDF4" : "#F1F1EF", color: bot.is_active ? "#15803D" : "#AFAFAC", padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                            {bot.is_active ? "● Actif" : "○ Inactif"}
                          </span>
                          <button onClick={() => toggleBot(bot)} style={{ padding: "6px 14px", background: bot.is_active ? "#FEF2F2" : "#F0FDF4", color: bot.is_active ? "#B91C1C" : "#15803D", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                            {bot.is_active ? "Désactiver" : "Activer"}
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                        {[
                          { l: "Interactions",  v: bot.total_interactions || 0, c: "#0B6BCB" },
                          { l: "Conversions",   v: bot.total_conversions  || 0, c: "#1D7F42" },
                          { l: "Escalades",     v: bot.total_escalations  || 0, c: "#C0392B" },
                          { l: "Taux esc.",     v: `${escRate}%`,              c: escRate > 20 ? "#B91C1C" : "#B35000" },
                          { l: "Modèle",        v: bot.sector_template || "—",  c: "#787774" },
                        ].map(({ l, v, c }) => (
                          <div key={l} style={{ background: "#F7F7F5", borderRadius: 8, padding: "9px 11px" }}>
                            <div style={{ fontSize: 10, color: "#AFAFAC", marginBottom: 2 }}>{l}</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: c }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {escRate > 25 && (
                        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#FEF2F2", borderRadius: 8, border: "1px solid #FECACA" }}>
                          <AlertTriangle size={13} color="#B91C1C" />
                          <span style={{ fontSize: 12, color: "#B91C1C", fontWeight: 600 }}>Taux d'escalade élevé — Revoir les flows chatbot</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredBots.length === 0 && <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Aucun chatbot</div>}
              </div>}
        </>
      )}

      {/* ── CHAT LEARNING ── */}
      {tab === "learning" && (
        <LearningQueue items={learningItems} onReview={reviewLearning} loading={loading} />
      )}
    </AdminLayout>
  );
}

function LearningQueue({ items, onReview, loading }: { items: any[]; onReview: (item: any, intent: string) => Promise<void>; loading: boolean }) {
  const [intents, setIntents] = useState<Record<string, string>>({});

  if (loading) return <div style={{ padding: "48px", textAlign: "center", color: "#AFAFAC" }}>Chargement...</div>;

  if (items.length === 0) return (
    <div style={{ padding: "64px 32px", textAlign: "center", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12 }}>
      <CheckCircle size={36} color="#BBF7D0" style={{ marginBottom: 12 }} />
      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>File d'apprentissage vide</div>
      <div style={{ fontSize: 13, color: "#787774" }}>Tous les messages ont été classifiés</div>
    </div>
  );

  const INTENTS = ["salutation", "commande", "reservation", "prix", "horaires", "localisation", "disponibilite", "rdv", "annulation", "autre"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ padding: "6px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 100, fontSize: 13, fontWeight: 700, color: "#B91C1C" }}>
          {items.length} message{items.length !== 1 ? "s" : ""} non classifié{items.length !== 1 ? "s" : ""}
        </div>
        <div style={{ fontSize: 12, color: "#787774" }}>Classifiez pour améliorer les chatbots</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(item => {
          const sec = SECTOR_CFG[item.sector] || { icon: "Bot", color: "#787774" };
          const conf = item.confidence_score ? Math.round(Number(item.confidence_score) * 100) : null;
          return (
            <div key={item.id} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${sec.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><SectorIcon name={sec.icon} size={16} color={sec.color} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>{item.company_name}</div>
                  <div style={{ fontSize: 12, color: "#787774" }}>
                    {item.detected_intent && <span style={{ marginRight: 8 }}>Intent détecté : <strong style={{ color: "#6B3FA0" }}>{item.detected_intent}</strong></span>}
                    {conf !== null && <span style={{ color: conf > 70 ? "#15803D" : conf > 40 ? "#C2410C" : "#B91C1C", fontWeight: 600 }}>Confiance : {conf}%</span>}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#AFAFAC" }}>{fmtRel(item.created_at)}</div>
              </div>

              {/* Message brut */}
              <div style={{ background: "#0B141A", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: "#005C4B", padding: "8px 12px", borderRadius: "12px 3px 12px 12px", maxWidth: "80%" }}>
                    <div style={{ fontSize: 13, color: "#E9EDEF", lineHeight: 1.5 }}>{item.raw_message}</div>
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#AFAFAC", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Classer comme</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {INTENTS.map(intent => (
                    <button key={intent} onClick={() => setIntents(p => ({ ...p, [item.id]: intent }))}
                      style={{ padding: "5px 12px", border: `1.5px solid ${intents[item.id] === intent ? "#6B3FA0" : "#E8E8E5"}`, borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: intents[item.id] === intent ? "#F5F0FF" : "#fff", color: intents[item.id] === intent ? "#6B3FA0" : "#787774", transition: "all 0.15s" }}>
                      {intent}
                    </button>
                  ))}
                  <input placeholder="Autre intent..." value={!INTENTS.includes(intents[item.id] || "") ? intents[item.id] || "" : ""}
                    onChange={e => setIntents(p => ({ ...p, [item.id]: e.target.value }))}
                    style={{ padding: "5px 12px", border: "1.5px solid #E8E8E5", borderRadius: 100, fontSize: 12, fontFamily: "inherit", outline: "none", minWidth: 120 }} />
                </div>
                <button onClick={() => onReview(item, intents[item.id] || "")} disabled={!intents[item.id]}
                  style={{ padding: "7px 16px", background: intents[item.id] ? "#6B3FA0" : "#E8E8E5", color: intents[item.id] ? "#fff" : "#AFAFAC", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: intents[item.id] ? "pointer" : "not-allowed", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={13} />Valider la classification
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
