// src/pages/ChatboxPage.tsx
// Page Chatbox autonome — réutilise la logique WhatsApp Cloud API
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MessageCircle, Search, ArrowLeft, Send, Smile, Phone, Bot, RefreshCw, Settings, ExternalLink } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface ChatSession { id: string; chatbot_id: string; client_phone: string; client_name: string | null; status: string; last_message_at: string; lastMessage?: string; unread?: number; }
interface ChatMessage { id: string; session_id: string; direction: "inbound" | "outbound"; content: string; message_type: string; is_escalated: boolean; created_at: string; }

const PALETTE = ["#2383E2","#1D7F42","#B35000","#C0392B","#6B3FA0","#0891B2"];
const avColor = (s: string) => PALETTE[(s?.charCodeAt(0)||0)%PALETTE.length];
const initials = (n: string) => (n||"?").split(" ").map(x=>x[0]).filter(Boolean).slice(0,2).join("").toUpperCase();
const fmtTime = (iso: string) => iso ? new Date(iso).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}) : "";
const fmtRel = (iso: string) => { const d=Date.now()-new Date(iso).getTime(); if(d<60000)return "À l'instant"; if(d<3600000)return `${Math.floor(d/60000)} min`; if(d<86400000)return `${Math.floor(d/3600000)} h`; return new Date(iso).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"}); };

export default function ChatboxPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cid = user?.company_id || "";
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [active, setActive] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [chatbot, setChatbot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from("companies").select("name,whatsapp_phone_number_id,whatsapp_number").eq("id", cid).single(),
        supabase.from("company_secrets").select("whatsapp_access_token").eq("company_id", cid).maybeSingle(),
      ]);
      setCompany(c ? { ...c, whatsapp_access_token: s?.whatsapp_access_token || null } : null);
    })();
    supabase.from("chatbots").select("*").eq("company_id", cid).maybeSingle().then(({ data }) => setChatbot(data));
  }, [cid]);

  const fetchSessions = useCallback(async () => {
    const { data } = await supabase.from("chat_sessions").select("*").eq("company_id", cid).order("last_message_at", { ascending: false }).limit(100);
    if (!data) { setLoading(false); return; }
    const enriched = await Promise.all(data.map(async s => {
      const { data: msgs } = await supabase.from("chat_messages").select("content,direction").eq("session_id", s.id).order("created_at", { ascending: false }).limit(1);
      const { count } = await supabase.from("chat_messages").select("id", { count: "exact", head: true }).eq("session_id", s.id).eq("direction", "inbound").gte("created_at", new Date(Date.now()-3600000).toISOString());
      return { ...s, lastMessage: msgs?.[0]?.content || "", unread: count || 0 };
    }));
    setSessions(enriched);
    setLoading(false);
  }, [cid]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  useEffect(() => {
    const ch = supabase.channel(`chatbox-page-${cid}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_sessions", filter: `company_id=eq.${cid}` }, () => fetchSessions())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `company_id=eq.${cid}` }, (p) => {
        const msg = p.new as ChatMessage;
        if (active?.id === msg.session_id) setMessages(prev => [...prev, msg]);
        fetchSessions();
        if (msg.direction === "inbound") toast("Nouveau message", { description: msg.content.slice(0, 60) });
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [cid, active, fetchSessions]);

  const openSession = async (s: ChatSession) => {
    setActive({ ...s, unread: 0 });
    setSessions(prev => prev.map(x => x.id === s.id ? { ...x, unread: 0 } : x));
    const { data } = await supabase.from("chat_messages").select("*").eq("session_id", s.id).order("created_at", { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMsg = async () => {
    if (!input.trim() || !active) return;
    if (!company?.whatsapp_phone_number_id || !company?.whatsapp_access_token) { toast.error("WhatsApp non configuré — Paramètres › Canaux"); return; }
    setSending(true);
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${company.whatsapp_phone_number_id}/messages`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${company.whatsapp_access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: active.client_phone.replace(/\D/g, ""), type: "text", text: { body: input } }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || "Erreur"); }
      const { data: newMsg } = await supabase.from("chat_messages").insert({
        company_id: cid, chatbot_id: chatbot?.id, session_id: active.id,
        direction: "outbound", content: input, message_type: "text", is_escalated: false,
      }).select().single();
      if (newMsg) setMessages(prev => [...prev, newMsg]);
      await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", active.id);
      setInput(""); fetchSessions();
    } catch (e: any) { toast.error(e.message); }
    finally { setSending(false); }
  };

  const isConfigured = company?.whatsapp_phone_number_id && company?.whatsapp_access_token;
  const totalUnread = sessions.reduce((s, c) => s + (c.unread || 0), 0);
  const filtered = sessions.filter(s => !searchVal || (s.client_name || s.client_phone).toLowerCase().includes(searchVal.toLowerCase()));

  return (
    <div style={{ height: "calc(100vh - 104px)", display: "flex", gap: 0, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 320, borderRight: "1px solid #E8E8E5", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #E8E8E5" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#128C7E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageCircle size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>WhatsApp</div>
                <div style={{ fontSize: 11, color: isConfigured ? "#15803D" : "#B91C1C", fontWeight: 600 }}>
                  {isConfigured ? "● Connecté" : "● Non configuré"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {totalUnread > 0 && <span style={{ background: "#15803D", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 700, padding: "2px 7px" }}>{totalUnread}</span>}
              <button onClick={() => navigate({ to: "/app/settings" })} style={{ width: 28, height: 28, borderRadius: 6, background: "#F7F7F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Configurer WhatsApp">
                <Settings size={13} color="#787774" />
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F7F7F5", borderRadius: 7, padding: "7px 10px" }}>
            <Search size={13} color="#AFAFAC" />
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Rechercher une conversation..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, fontFamily: "inherit", flex: 1 }} />
          </div>
        </div>

        {/* Sessions */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading && <div style={{ padding: "24px", textAlign: "center", color: "#AFAFAC", fontSize: 13 }}>Chargement...</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <MessageCircle size={32} color="#E8E8E5" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>
                {searchVal ? "Aucun résultat" : "Aucune conversation"}
              </div>
              <div style={{ fontSize: 12, color: "#AFAFAC" }}>
                {!isConfigured ? "Configurez WhatsApp dans Paramètres" : "Les messages entrants apparaîtront ici"}
              </div>
              {!isConfigured && (
                <button onClick={() => navigate({ to: "/app/settings" })} style={{ marginTop: 12, padding: "6px 14px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Configurer →
                </button>
              )}
            </div>
          )}
          {filtered.map(s => (
            <div key={s.id} onClick={() => openSession(s)} style={{
              display: "flex", gap: 10, padding: "12px 16px", cursor: "pointer",
              borderBottom: "1px solid #F7F7F5",
              background: active?.id === s.id ? "#F0FDF4" : "transparent", transition: "background 0.1s",
            }}
            onMouseEnter={e => { if (active?.id !== s.id) e.currentTarget.style.background = "#F7F7F5"; }}
            onMouseLeave={e => { if (active?.id !== s.id) e.currentTarget.style.background = "transparent"; }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: avColor(s.client_phone), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                  {initials(s.client_name || s.client_phone)}
                </div>
                {s.status === "active" && <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#15803D", border: "2px solid #fff" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, fontWeight: (s.unread||0)>0?700:600, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.client_name || s.client_phone}
                  </span>
                  <span style={{ fontSize: 10, color: "#AFAFAC", flexShrink: 0, marginLeft: 4 }}>{fmtRel(s.last_message_at)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <span style={{ fontSize: 12, color: "#787774", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{s.lastMessage || "—"}</span>
                  {(s.unread||0)>0 && <span style={{ background: "#15803D", color: "#fff", borderRadius: 100, fontSize: 10, fontWeight: 700, padding: "1px 6px", marginLeft: 6, flexShrink: 0 }}>{s.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer stats */}
        <div style={{ padding: "10px 16px", borderTop: "1px solid #E8E8E5", background: "#F7F7F5", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#AFAFAC" }}>{sessions.length} conversation{sessions.length!==1?"s":""}</span>
          <button onClick={fetchSessions} style={{ fontSize: 11, color: "#2383E2", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={11} style={{ verticalAlign: "middle", marginRight: 3 }} />Actualiser
          </button>
        </div>
      </div>

      {/* Zone chat */}
      {active ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #E8E8E5", display: "flex", alignItems: "center", gap: 10, background: "#fff" }}>
            <button onClick={() => setActive(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#787774", display: "flex", padding: 4, borderRadius: 5 }}><ArrowLeft size={16} /></button>
            <div style={{ position: "relative" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: avColor(active.client_phone), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                {initials(active.client_name || active.client_phone)}
              </div>
              {active.status === "active" && <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "#15803D", border: "1.5px solid #fff" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{active.client_name || active.client_phone}</div>
              <div style={{ fontSize: 11, color: "#15803D", fontWeight: 500 }}>{active.client_phone}</div>
            </div>
            <a href={`https://wa.me/${active.client_phone.replace(/\D/g,"")}`} target="_blank"
              style={{ width: 32, height: 32, borderRadius: 7, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <Phone size={14} color="#15803D" />
            </a>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px 20px",
            background: "#ECE5DD",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px", color: "#787774", fontSize: 13 }}>Début de la conversation</div>
            )}
            {messages.map(msg => {
              const out = msg.direction === "outbound";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6, marginBottom: 2 }}>
                  {!out && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#128C7E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot size={13} color="#fff" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: "62%", background: out ? "#DCF8C6" : "#fff",
                    borderRadius: out ? "12px 12px 3px 12px" : "3px 12px 12px 12px",
                    padding: "9px 12px 6px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}>
                    <div style={{ fontSize: 13.5, color: "#1A1A1A", lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
                      <span style={{ fontSize: 10.5, color: "#787774" }}>{fmtTime(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 16px", background: "#F0F0F0", borderTop: "1px solid #E8E8E5", display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}><Smile size={20} color="#787774" /></button>
            <div style={{ flex: 1, background: "#fff", borderRadius: 24, padding: "9px 18px", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMsg())}
                placeholder={isConfigured ? "Tapez votre réponse..." : "WhatsApp non configuré — Paramètres › Canaux"}
                disabled={!isConfigured}
                style={{ width: "100%", border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "transparent", color: "#1A1A1A" }} />
            </div>
            <button onClick={sendMsg} disabled={!input.trim() || sending || !isConfigured} style={{
              width: 44, height: 44, borderRadius: "50%", background: input.trim() && isConfigured ? "#128C7E" : "#CDCDCA",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s", flexShrink: 0,
            }}>
              {sending ? <RefreshCw size={17} color="#fff" style={{ animation: "spin 1s linear infinite" }} /> : <Send size={18} color="#fff" />}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#F7F7F5" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#128C7E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MessageCircle size={30} color="#fff" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>Chatbox WhatsApp</div>
            <div style={{ fontSize: 13, color: "#787774", maxWidth: 320, lineHeight: 1.6 }}>
              {isConfigured
                ? "Sélectionnez une conversation pour répondre à vos clients en temps réel."
                : "Votre numéro WhatsApp n'est pas encore configuré."}
            </div>
          </div>
          {!isConfigured && (
            <button onClick={() => navigate({ to: "/app/settings" })} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <Settings size={14} />Configurer WhatsApp
            </button>
          )}
          {sessions.length > 0 && (
            <div style={{ padding: "6px 16px", background: "#F0FDF4", borderRadius: 100, border: "1px solid #BBF7D0" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#15803D" }}>{sessions.length} conversation{sessions.length>1?"s":""} · {totalUnread} non lue{totalUnread>1?"s":""}</span>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
