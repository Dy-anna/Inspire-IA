export const colors = {
  bg: "#F7F7F5",
  white: "#FFFFFF",
  border: "#E8E8E5",
  borderDark: "#CDCDCA",
  text1: "#1A1A1A",
  text2: "#787774",
  text3: "#AFAFAC",
  accent: "#2383E2",
  accentLight: "#EDF3FC",
  sidebar: "#1C1F3B",
  sidebarText: "rgba(255,255,255,0.85)",
  sidebarMuted: "rgba(255,255,255,0.45)",
  tags: {
    blue: { bg: "#E8F3FF", text: "#0B6BCB" },
    green: { bg: "#E6F4EA", text: "#1D7F42" },
    amber: { bg: "#FFF3E0", text: "#B35000" },
    red: { bg: "#FDE8E8", text: "#C0392B" },
    purple: { bg: "#F3EDFC", text: "#6B3FA0" },
    gray: { bg: "#F1F1EF", text: "#787774" },
  },
  sectors: {
    restaurant: "#B35000",
    real_estate: "#1D7F42",
    travel_agency: "#0B6BCB",
    private_school: "#6B3FA0",
    private_clinic: "#C0392B",
  },
} as const;

export const SECTOR_LABELS: Record<string, string> = {
  restaurant: "Restaurant",
  real_estate: "Immobilier",
  travel_agency: "Agence Voyage",
  private_school: "École privée",
  private_clinic: "Clinique",
  hotel: "Hôtellerie",
  event: "Événementiel",
};
