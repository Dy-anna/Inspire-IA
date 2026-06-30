// src/components/AvatarPicker.tsx
// Sélecteur d'avatar — 26 personnages locaux par secteur

import { useState } from "react";
import { useRef } from "react";

// ─── Données ──────────────────────────────────────────────────────────────────

// Catégorisation des 26 avatars (public/avatars/avatar-N.png)
const SECTORS: Record<string, {
  label: string;
  color: string;
  ids: number[];
}> = {
  all: {
    label: "Tous",
    color: "#1A1A1A",
    ids: Array.from({ length: 26 }, (_, i) => i + 1),
  },
  restaurant: {
    label: "Restaurant",
    color: "#B35000",
    ids: [16, 15, 17],
  },
  real_estate: {
    label: "Immobilier",
    color: "#1D7F42",
    ids: [11, 10, 18, 6, 12],
  },
  travel_agency: {
    label: "Voyage",
    color: "#0B6BCB",
    ids: [5, 3, 8, 9, 2],
  },
  private_clinic: {
    label: "Clinique",
    color: "#C0392B",
    ids: [19, 1, 20, 21, 22],
  },
  private_school: {
    label: "École",
    color: "#6B3FA0",
    ids: [23, 24, 25, 26, 13, 14],
  },
};

// ─── Helpers URL ──────────────────────────────────────────────────────────────

export function avatarUrlById(id: number): string {
  const safe = ((id - 1) % 26 + 26) % 26 + 1;
  return `/avatars/avatar-${safe}.png`;
}

// Compat: ancienne API utilisée par RestaurantCRM (seed string).
// Hash déterministe → un des avatars du secteur restaurant.
export function buildAvatarUrl(seed: string, bgIndex: number = 0): string {
  // Si le seed commence par un préfixe sectoriel connu, restreint à ce secteur.
  const prefixMap: Record<string, string> = {
    "chef-": "restaurant",
    "immo-": "real_estate",
    "voyage-": "travel_agency",
    "dr-": "private_clinic",
    "inf-": "private_clinic",
    "prof-": "private_school",
  };
  let pool = SECTORS.all.ids;
  for (const [pref, sec] of Object.entries(prefixMap)) {
    if (seed.startsWith(pref)) { pool = SECTORS[sec].ids; break; }
  }
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const id = pool[(h + bgIndex) % pool.length];
  return avatarUrlById(id);
}

// ─── Composant principal ──────────────────────────────────────────────────────

interface AvatarPickerProps {
  selected?: string | null;
  onSelect: (url: string) => void;
  defaultSector?: string;
  size?: number;
}

export function AvatarPicker({
  selected,
  onSelect,
  defaultSector = "all",
  size = 72,
}: AvatarPickerProps) {
  const initial = Object.keys(SECTORS).includes(defaultSector) ? defaultSector : "all";
  const [activeSector, setActiveSector] = useState<string>(initial);
  const sector = SECTORS[activeSector];

  return (
    <div>
      {/* Onglets secteurs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(SECTORS).map(([key, s]) => {
          const isActive = activeSector === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSector(key)}
              style={{
                padding: "6px 14px",
                border: "none",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                background: isActive ? s.color : "#F7F7F5",
                color: isActive ? "#fff" : "#787774",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Grille */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${size + 24}px, 1fr))`,
          gap: 10,
        }}
      >
        {sector.ids.map((id) => {
          const url = avatarUrlById(id);
          const isSelected = selected === url;
          return (
            <div
              key={id}
              onClick={() => onSelect(url)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: 8,
                borderRadius: 12,
                cursor: "pointer",
                border: isSelected
                  ? `2px solid ${sector.color}`
                  : "2px solid #E8E8E5",
                background: isSelected ? `${sector.color}10` : "#fff",
                transition: "all 0.15s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#CDCDCA";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#E8E8E5";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: sector.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                  }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#F7F7F5",
                  flexShrink: 0,
                }}
              >
                <img
                  src={url}
                  alt={`Avatar ${id}`}
                  width={size}
                  height={size}
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Modale ───────────────────────────────────────────────────────────────────

interface AvatarPickerModalProps {
  currentUrl?: string | null;
  currentSector?: string;
  onClose: () => void;
  onSave: (url: string) => void;
}

export function AvatarPickerModal({
  currentUrl,
  currentSector = "all",
  onClose,
  onSave,
}: AvatarPickerModalProps) {
  const [selected, setSelected] = useState<string | null>(currentUrl || null);
  const sector = SECTORS[currentSector] || SECTORS.all;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Format non supporté. Choisissez une image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Image trop volumineuse (max 4 Mo).");
      return;
    }
    // Redimensionne côté client pour rester léger en stockage
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 256;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { setSelected(reader.result as string); return; }
        ctx.drawImage(img, 0, 0, w, h);
        setSelected(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => setSelected(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = () => setUploadError("Lecture du fichier impossible.");
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.3)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "24px 28px 28px",
          width: 720,
          maxWidth: "95vw",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>
              Choisir votre avatar
            </div>
            <div style={{ fontSize: 13, color: "#787774", marginTop: 2 }}>
              Sélectionnez le personnage qui vous représente
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#AFAFAC",
              padding: 4,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <AvatarPicker
          selected={selected}
          onSelect={setSelected}
          defaultSector={currentSector}
          size={72}
        />

        {/* Téléversement d'une photo personnelle */}
        <div
          style={{
            marginTop: 18,
            padding: "14px 16px",
            background: "#fff",
            border: "1px dashed #CDCDCA",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "#F1F1EF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="#787774" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#787774" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              Utiliser une photo personnelle
            </div>
            <div style={{ fontSize: 11, color: "#787774", marginTop: 2 }}>
              JPG, PNG ou WebP — 4 Mo max. L'image est redimensionnée automatiquement.
            </div>
            {uploadError && (
              <div style={{ fontSize: 11, color: "#C0392B", marginTop: 4 }}>{uploadError}</div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "8px 14px",
              background: "#1A1A1A",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            Parcourir…
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 20,
            padding: "14px 16px",
            background: "#F7F7F5",
            borderRadius: 10,
            border: "1px solid #E8E8E5",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#F1F1EF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {selected ? (
              <img src={selected} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#CDCDCA" strokeWidth="1.5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#CDCDCA" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              {selected ? "Avatar sélectionné" : "Aucun avatar sélectionné"}
            </div>
            <div style={{ fontSize: 11, color: "#AFAFAC", marginTop: 1 }}>
              Cliquez sur un personnage pour le choisir
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                background: "#fff",
                border: "1px solid #E8E8E5",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => { if (selected) { onSave(selected); } }}
              disabled={!selected}
              style={{
                padding: "8px 20px",
                background: selected ? sector.color : "#E8E8E5",
                color: selected ? "#fff" : "#AFAFAC",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: selected ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                transition: "background 0.15s",
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarPicker;
