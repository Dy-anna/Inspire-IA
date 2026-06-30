import { Download, FileText } from "lucide-react";
import { exportStatsCSV, exportStatsPDF, type StatsSection } from "@/lib/exportStats";

interface Props {
  title: string;
  filenameBase: string;
  getSections: () => StatsSection[];
  disabled?: boolean;
}

export function ExportStatsButtons({ title, filenameBase, getSections, disabled }: Props) {
  const btn = (bg: string): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 12px", background: bg, color: "#fff", border: "none",
    borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", opacity: disabled ? 0.5 : 1,
  });
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button disabled={disabled} onClick={() => exportStatsCSV(filenameBase, getSections())} style={btn("#1A1A1A")}>
        <Download size={13} /> CSV
      </button>
      <button disabled={disabled} onClick={() => exportStatsPDF(title, getSections(), filenameBase)} style={btn("#9A3412")}>
        <FileText size={13} /> PDF
      </button>
    </div>
  );
}

export default ExportStatsButtons;
