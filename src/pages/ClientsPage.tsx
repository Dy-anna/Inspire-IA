// src/pages/ClientsPage.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Users, Search, X, Plus, ChevronRight, Phone, Mail, MessageCircle, Calendar, Filter, Check } from "lucide-react";

interface Client {
  id: string; company_id: string; full_name: string;
  phone: string | null; whatsapp: string | null; email: string | null;
  total_interactions: number | null; last_interaction_at: string | null;
  is_active: boolean | null; notes: string | null; created_at: string;
}

const PALETTE = ["#2383E2","#1D7F42","#B35000","#C0392B","#6B3FA0","#0891B2"];
const avColor = (s: string) => PALETTE[(s?.charCodeAt(0)||0)%PALETTE.length];
const initials = (n: string) => (n||"?").split(" ").map(x=>x[0]).filter(Boolean).slice(0,2).join("").toUpperCase();
const fmtDate = (iso: string) => iso ? new Date(iso).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const fmtRel = (iso: string|null) => {
  if(!iso) return "—";
  const d = Date.now()-new Date(iso).getTime();
  if(d<60000) return "À l'instant";
  if(d<3600000) return `Il y a ${Math.floor(d/60000)} min`;
  if(d<86400000) return `Il y a ${Math.floor(d/3600000)} h`;
  if(d<7*86400000) return `Il y a ${Math.floor(d/86400000)} j`;
  return fmtDate(iso);
};

function ClientPanel({client,onClose,onUpdate}:{client:Client;onClose:()=>void;onUpdate:(id:string,p:Partial<Client>)=>void}) {
  const [notes,setNotes] = useState(client.notes||"");
  const deb = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const save = (v:string)=>{ setNotes(v); clearTimeout(deb.current); deb.current=setTimeout(()=>onUpdate(client.id,{notes:v}),900); };
  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div onClick={onClose} style={{flex:1,background:"rgba(0,0,0,0.2)",cursor:"pointer"}}/>
      <div style={{width:420,background:"#fff",borderLeft:"1px solid #E8E8E5",display:"flex",flexDirection:"column",overflow:"hidden",animation:"panelIn 0.22s cubic-bezier(0.22,1,0.36,1)"}}>
        <div style={{padding:"20px 24px 16px",borderBottom:"1px solid #E8E8E5"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:avColor(client.full_name),color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700}}>{initials(client.full_name)}</div>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:"#1A1A1A"}}>{client.full_name}</div>
                <div style={{fontSize:12,color:"#787774"}}>Client depuis {fmtDate(client.created_at)}</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#AFAFAC",padding:4}}><X size={18}/></button>
          </div>
          <div style={{display:"flex",gap:6,marginTop:12}}>
            <span style={{background:client.is_active?"#F0FDF4":"#F1F1EF",color:client.is_active?"#15803D":"#787774",padding:"2px 8px",borderRadius:5,fontSize:12,fontWeight:600}}>{client.is_active?"Actif":"Inactif"}</span>
            <span style={{background:"#EFF6FF",color:"#1D4ED8",padding:"2px 8px",borderRadius:5,fontSize:12,fontWeight:600}}>{client.total_interactions||0} interactions</span>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"0 24px 24px"}}>
          <div style={{marginTop:20}}>
            <div style={{fontSize:10,fontWeight:700,color:"#AFAFAC",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Contact</div>
            {[
              ["Téléphone",client.phone||"—"],
              ["WhatsApp",client.whatsapp||client.phone||"—"],
              ["Email",client.email||"—"],
              ["Dernière interaction",fmtRel(client.last_interaction_at)],
            ].map(([l,v])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:16,padding:"7px 0",borderBottom:"1px solid #F7F7F5"}}>
                <span style={{width:130,fontSize:13,color:"#787774",flexShrink:0}}>{l}</span>
                <span style={{fontSize:14,color:"#1A1A1A",fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
          {(client.whatsapp||client.phone)&&(
            <a href={`https://wa.me/${(client.whatsapp||client.phone||"").replace(/\D/g,"")}`} target="_blank" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:16,padding:"9px",background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,fontSize:13,fontWeight:600,color:"#15803D",textDecoration:"none"}}>
              <MessageCircle size={15}/>Envoyer un message WhatsApp
            </a>
          )}
          <div style={{marginTop:22}}>
            <div style={{fontSize:10,fontWeight:700,color:"#AFAFAC",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Notes</div>
            <textarea value={notes} onChange={e=>save(e.target.value)} placeholder="Notes internes..."
              style={{width:"100%",minHeight:80,border:"none",outline:"none",resize:"none",fontSize:14,fontFamily:"inherit",background:"transparent",lineHeight:1.6}}/>
          </div>
          <div style={{marginTop:16,display:"flex",gap:8}}>
            <button onClick={()=>onUpdate(client.id,{is_active:!client.is_active})} style={{flex:1,padding:"9px",background:client.is_active?"#FEF2F2":"#F0FDF4",color:client.is_active?"#B91C1C":"#15803D",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              {client.is_active?"Désactiver":"Activer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const {user} = useAuth();
  const cid = user?.company_id||"";
  const [clients,setClients] = useState<Client[]>([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");
  const [selected,setSelected] = useState<Client|null>(null);
  const [showModal,setShowModal] = useState(false);
  const [newName,setNewName] = useState(""); const [newPhone,setNewPhone] = useState(""); const [newEmail,setNewEmail] = useState("");
  const [saving,setSaving] = useState(false);
  const [color,setColor] = useState("#1A1A1A");

  const fetch = useCallback(async()=>{
    if(!cid) return;
    const {data} = await supabase.from("clients").select("*").eq("company_id",cid).order("created_at",{ascending:false}).limit(200);
    if(data) setClients(data);
    if (user?.sector) {
      const { data: cfg } = await supabase.from("sector_configs").select("color").eq("sector", user.sector).single();
      if (cfg?.color) setColor(cfg.color);
    }
    setLoading(false);
  },[cid]);

  useEffect(()=>{fetch();},[fetch]);

  const update = async(id:string,patch:Partial<Client>)=>{
    const {error} = await supabase.from("clients").update(patch).eq("id",id);
    if(error){toast.error("Erreur");return;}
    toast.success("Client mis à jour");
    setClients(prev=>prev.map(c=>c.id===id?{...c,...patch}:c));
    if(selected?.id===id) setSelected(prev=>prev?{...prev,...patch}:prev);
  };

  const create = async()=>{
    if(!newName.trim()){toast.error("Le nom est requis");return;}
    setSaving(true);
    const {data,error} = await supabase.from("clients").insert({
      company_id:cid, full_name:newName.trim(),
      phone:newPhone.trim()||null, whatsapp:newPhone.trim()||null,
      email:newEmail.trim()||null, is_active:true,
    }).select().single();
    if(error){toast.error("Erreur");setSaving(false);return;}
    toast.success("Client ajouté");
    setClients(prev=>[data,...prev]);
    setShowModal(false); setNewName(""); setNewPhone(""); setNewEmail("");
    setSaving(false);
  };

  const filtered = clients.filter(c=>!search||(c.full_name||"").toLowerCase().includes(search.toLowerCase())||(c.phone||"").includes(search)||(c.email||"").toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{maxWidth:1200,margin:"0 auto"}}>
      <style>{`@keyframes panelIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:"#1A1A1A",margin:0}}>Clients</h1>
          <p style={{fontSize:13,color:"#787774",margin:"3px 0 0"}}>{clients.length} client{clients.length!==1?"s":""}</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:color,color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
          <Plus size={15}/>Nouveau client
        </button>
      </div>

      {/* Search */}
      <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #E8E8E5",borderRadius:7,padding:"7px 12px",marginBottom:14,maxWidth:360}}>
        <Search size={13} color="#AFAFAC"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom, téléphone, email..."
          style={{border:"none",outline:"none",fontSize:13,fontFamily:"inherit",flex:1,background:"transparent"}}/>
        {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"#AFAFAC",padding:0,display:"flex"}}><X size={12}/></button>}
      </div>

      {/* Table */}
      <div style={{background:"#fff",border:"1px solid #E8E8E5",borderRadius:10,overflow:"hidden"}}>
        <div style={{display:"flex",background:"#F7F7F5",borderBottom:"1px solid #E8E8E5",padding:"0 16px"}}>
          {[{l:"Client",w:220},{l:"Téléphone",w:150},{l:"Email",w:200},{l:"Interactions",w:110},{l:"Dernière activité",w:150},{l:"Statut",w:90},{l:"",w:40}].map(({l,w})=>(
            <div key={l} style={{width:w,padding:"9px 10px",fontSize:11,fontWeight:700,color:"#AFAFAC",textTransform:"uppercase",letterSpacing:"0.06em",flexShrink:0}}>{l}</div>
          ))}
        </div>

        {loading?[...Array(5)].map((_,i)=>(
          <div key={i} style={{height:50,borderBottom:"1px solid #F1F1EF",display:"flex",alignItems:"center",padding:"0 26px",gap:16}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"#F1F1EF"}}/>
            <div style={{width:120,height:12,background:"#F1F1EF",borderRadius:4}}/>
          </div>
        )):filtered.length===0?(
          <div style={{padding:"56px 32px",textAlign:"center"}}>
            <Users size={36} color="#E8E8E5" style={{marginBottom:12}}/>
            <div style={{fontSize:14,fontWeight:600,color:"#1A1A1A",marginBottom:4}}>{search?"Aucun résultat":"Aucun client"}</div>
            <div style={{fontSize:13,color:"#787774"}}>{search?"Modifiez votre recherche.":"Ajoutez votre premier client."}</div>
          </div>
        ):filtered.map((c,idx)=>(
          <div key={c.id} onClick={()=>setSelected(c)} style={{
            display:"flex",alignItems:"center",padding:"0 16px",height:50,
            borderBottom:idx<filtered.length-1?"1px solid #F1F1EF":"none",
            cursor:"pointer",background:selected?.id===c.id?"#F7F7F5":"transparent"}}
            onMouseEnter={e=>{if(selected?.id!==c.id)e.currentTarget.style.background="#FAFAFA";}}
            onMouseLeave={e=>{if(selected?.id!==c.id)e.currentTarget.style.background="transparent";}}>
            <div style={{width:220,padding:"0 10px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:avColor(c.full_name),color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{initials(c.full_name)}</div>
              <span style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.full_name}</span>
            </div>
            <div style={{width:150,padding:"0 10px",flexShrink:0}}>
              {c.phone?<a href={`https://wa.me/${(c.whatsapp||c.phone||"").replace(/\D/g,"")}`} target="_blank" onClick={e=>e.stopPropagation()} style={{fontSize:13,color:"#15803D",textDecoration:"none"}}>{c.phone}</a>:<span style={{color:"#AFAFAC",fontSize:13}}>—</span>}
            </div>
            <div style={{width:200,padding:"0 10px",flexShrink:0}}>
              <span style={{fontSize:13,color:"#787774",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{c.email||"—"}</span>
            </div>
            <div style={{width:110,padding:"0 10px",flexShrink:0}}>
              <span style={{fontSize:13,color:"#1A1A1A",fontWeight:500}}>{c.total_interactions||0}</span>
            </div>
            <div style={{width:150,padding:"0 10px",flexShrink:0}}>
              <span style={{fontSize:12,color:"#AFAFAC"}}>{fmtRel(c.last_interaction_at)}</span>
            </div>
            <div style={{width:90,padding:"0 10px",flexShrink:0}}>
              <span style={{background:c.is_active?"#F0FDF4":"#F1F1EF",color:c.is_active?"#15803D":"#787774",padding:"2px 8px",borderRadius:5,fontSize:12,fontWeight:600}}>{c.is_active?"Actif":"Inactif"}</span>
            </div>
            <div style={{width:40,padding:"0 4px",flexShrink:0}}><ChevronRight size={14} color="#AFAFAC"/></div>
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:7,padding:"9px 26px",color:"#AFAFAC",cursor:"pointer",borderTop:"1px solid #F1F1EF",fontSize:13}}
          onClick={()=>setShowModal(true)}
          onMouseEnter={e=>e.currentTarget.style.background="#F7F7F5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <Plus size={14}/>Nouveau client
        </div>
      </div>

      {/* Modal nouveau client */}
      {showModal&&(
        <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.25)"}}>
          <div style={{background:"#fff",borderRadius:12,padding:28,width:380,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:20}}>Nouveau client</div>
            {[{label:"Nom complet *",val:newName,set:setNewName,ph:"Kouamé Assi"},{label:"Téléphone / WhatsApp",val:newPhone,set:setNewPhone,ph:"+22507111222"},{label:"Email",val:newEmail,set:setNewEmail,ph:"email@exemple.com"}].map(({label,val,set,ph})=>(
              <div key={label} style={{marginBottom:14}}>
                <label style={{fontSize:13,fontWeight:500,display:"block",marginBottom:6}}>{label}</label>
                <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}
                  style={{width:"100%",padding:"9px 12px",border:"1px solid #E8E8E5",borderRadius:7,fontSize:14,fontFamily:"inherit",outline:"none"}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <button onClick={()=>setShowModal(false)} style={{flex:1,padding:"9px",background:"#F7F7F5",border:"1px solid #E8E8E5",borderRadius:7,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
              <button onClick={create} disabled={saving} style={{flex:1,padding:"9px",background:color,color:"#fff",border:"none",borderRadius:7,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                {saving?"Création...":"Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selected&&<ClientPanel client={selected} onClose={()=>setSelected(null)} onUpdate={update}/>}
    </div>
  );
}