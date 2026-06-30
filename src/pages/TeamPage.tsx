// src/pages/TeamPage.tsx
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserPlus, X, MoreHorizontal, Check, Shield, User, Crown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

interface TeamMember { id: string; email: string; full_name: string; role: string; is_active: boolean; last_seen_at: string | null; created_at: string; avatar_url: string | null; }

const PALETTE = ["#2383E2","#1D7F42","#B35000","#C0392B","#6B3FA0","#0891B2"];
const avColor = (s: string) => PALETTE[(s?.charCodeAt(0)||0)%PALETTE.length];
const initials = (n: string) => (n||"?").split(" ").map(x=>x[0]).filter(Boolean).slice(0,2).join("").toUpperCase();
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
const fmtRel = (iso: string|null) => {
  if (!iso) return "Jamais";
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `Il y a ${Math.floor(d/60000)} min`;
  if (d < 86400000) return `Il y a ${Math.floor(d/3600000)} h`;
  return fmtDate(iso);
};

const ROLE_CFG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  owner: { label: "Propriétaire", icon: Crown, color: "#B35000", bg: "#FFF7ED" },
  admin: { label: "Administrateur", icon: Shield, color: "#0B6BCB", bg: "#EFF6FF" },
  member: { label: "Membre", icon: User, color: "#787774", bg: "#F1F1EF" },
};

export default function TeamPage() {
  const { user } = useAuth();
  const cid = user?.company_id || "";
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [changeRoleModal, setChangeRoleModal] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState("");
  const [color, setColor] = useState("#1A1A1A");

  const fetch = useCallback(async () => {
    if (!cid) return;
    const { data } = await supabase.from("users").select("id, email, full_name, role, is_active, last_seen_at, created_at, avatar_url").eq("company_id", cid).order("created_at");
    if (data) setMembers(data);
    if (user?.sector) {
      const { data: cfg } = await supabase.from("sector_configs").select("color").eq("sector", user.sector).single();
      if (cfg?.color) setColor(cfg.color);
    }
    setLoading(false);
  }, [cid]);

  useEffect(() => { fetch(); }, [fetch]);

  const sendInvite = async () => {
    if (!inviteEmail.trim()) { toast.error("Email requis"); return; }
    setSaving(true);
    try {
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", inviteEmail.toLowerCase()).eq("company_id", cid).maybeSingle();
      if (existingUser) { toast.error("Cet utilisateur fait déjà partie de l'équipe"); setSaving(false); return; }
      toast.success(`Invitation envoyée à ${inviteEmail} — ils peuvent créer un compte avec cet email.`);
      setShowInvite(false);
      setInviteEmail("");
      setInviteRole("member");
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const changeRole = async () => {
    if (!changeRoleModal || !newRole) return;
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", changeRoleModal.id);
    if (error) { toast.error("Erreur"); return; }
    toast.success("Rôle mis à jour");
    setMembers(prev => prev.map(m => m.id === changeRoleModal.id ? { ...m, role: newRole } : m));
    setChangeRoleModal(null);
  };

  const toggleActive = async (member: TeamMember) => {
    if (member.role === "owner") { toast.error("Impossible de désactiver le propriétaire"); return; }
    const { error } = await supabase.from("users").update({ is_active: !member.is_active }).eq("id", member.id);
    if (error) { toast.error("Erreur"); return; }
    toast.success(member.is_active ? "Membre désactivé" : "Membre activé");
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_active: !m.is_active } : m));
    setMenuOpen(null);
  };

  const canManage = user?.role === "owner" || user?.role === "admin";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>Équipe</h1>
          <p style={{ fontSize: 13, color: "#787774", margin: "3px 0 0" }}>{members.filter(m=>m.is_active).length} membre{members.filter(m=>m.is_active).length!==1?"s":""} actif{members.filter(m=>m.is_active).length!==1?"s":""}</p>
        </div>
        {canManage && (
          <button onClick={() => setShowInvite(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: color, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <UserPlus size={15} />Inviter un membre
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[...Array(3)].map((_, i) => <div key={i} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, height: 140, animation: "pulse 1.5s ease-in-out infinite" }} />)}
        </div>
      ) : members.length === 0 ? (
        <div style={{ padding: "64px 32px", textAlign: "center", background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Aucun membre</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {members.map(member => {
            const roleCfg = ROLE_CFG[member.role] || ROLE_CFG.member;
            const RoleIcon = roleCfg.icon;
            const isSelf = member.id === user?.id;
            return (
              <div key={member.id} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: 10, padding: 20, position: "relative", opacity: member.is_active ? 1 : 0.6 }}>
                {/* Menu */}
                {canManage && !isSelf && (
                  <div style={{ position: "absolute", top: 14, right: 14 }}>
                    <button onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)} style={{ width: 28, height: 28, borderRadius: 6, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F7F7F5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <MoreHorizontal size={16} color="#787774" />
                    </button>
                    {menuOpen === member.id && (
                      <div style={{ position: "absolute", top: "100%", right: 0, zIndex: 100, background: "#fff", border: "1px solid #E8E8E5", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: 4, minWidth: 170 }}>
                        {[
                          { label: "Changer le rôle", action: () => { setChangeRoleModal(member); setNewRole(member.role); setMenuOpen(null); } },
                          { label: member.is_active ? "Désactiver" : "Réactiver", action: () => toggleActive(member) },
                        ].map(({ label, action }) => (
                          <div key={label} onClick={action} style={{ padding: "7px 12px", cursor: "pointer", fontSize: 13, borderRadius: 5, color: label.includes("Désactiver") ? "#B91C1C" : "#1A1A1A" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#F7F7F5"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            {label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ position: "relative" }}>
                    <Avatar name={member.full_name || member.email} src={member.avatar_url} size={46} />
                    {isSelf && <div style={{ position: "absolute", bottom: 0, right: 0, width: 13, height: 13, borderRadius: "50%", background: "#15803D", border: "2px solid #fff" }} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {member.full_name || "Sans nom"} {isSelf && <span style={{ fontSize: 11, color: "#787774", fontWeight: 400 }}>(vous)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#787774", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.email}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  <span style={{ background: roleCfg.bg, color: roleCfg.color, padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <RoleIcon size={11} />{roleCfg.label}
                  </span>
                  {!member.is_active && <span style={{ background: "#F1F1EF", color: "#787774", padding: "2px 8px", borderRadius: 5, fontSize: 12, fontWeight: 600 }}>Inactif</span>}
                </div>

                <div style={{ fontSize: 11, color: "#AFAFAC" }}>
                  Membre depuis {fmtDate(member.created_at)}
                </div>
                <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 2 }}>
                  Dernière activité : {fmtRel(member.last_seen_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Inviter un membre</div>
              <button onClick={() => setShowInvite(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#AFAFAC" }}><X size={18} /></button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Email *</label>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@exemple.com"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: "block", marginBottom: 6 }}>Rôle</label>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
                <option value="admin">Administrateur</option>
                <option value="member">Membre</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowInvite(false)} style={{ flex: 1, padding: "9px", background: "#F7F7F5", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
              <button onClick={sendInvite} disabled={saving} style={{ flex: 1, padding: "9px", background: color, color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {saving ? "Envoi..." : "Envoyer l'invitation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change role modal */}
      {changeRoleModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 340, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Changer le rôle de {changeRoleModal.full_name}</div>
            {["admin", "member"].map(r => {
              const cfg = ROLE_CFG[r];
              const RoleIcon = cfg.icon;
              return (
                <div key={r} onClick={() => setNewRole(r)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `2px solid ${newRole === r ? "#1A1A1A" : "#E8E8E5"}`, marginBottom: 8 }}>
                  <RoleIcon size={16} color={cfg.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{cfg.label}</div>
                  </div>
                  {newRole === r && <Check size={14} color="#1A1A1A" />}
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => setChangeRoleModal(null)} style={{ flex: 1, padding: "9px", background: "#F7F7F5", border: "1px solid #E8E8E5", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
              <button onClick={changeRole} style={{ flex: 1, padding: "9px", background: color, color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}