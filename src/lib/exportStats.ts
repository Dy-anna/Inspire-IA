// Utilitaires d'export de statistiques (CSV + PDF) pour les CRM
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface StatsSection {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

const sanitize = (v: any): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
};

export function exportStatsCSV(filenameBase: string, sections: StatsSection[]) {
  const lines: string[] = [];
  sections.forEach((sec, idx) => {
    if (idx > 0) lines.push("");
    lines.push(sanitize(sec.title));
    lines.push(sec.headers.map(sanitize).join(","));
    sec.rows.forEach((r) => lines.push(r.map(sanitize).join(",")));
  });
  const csv = "\uFEFF" + lines.join("\n");
  const stamp = new Date().toISOString().slice(0, 10);
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${filenameBase}_${stamp}.csv`);
}

// jsPDF default fonts use WinAnsi encoding which only supports Latin-1.
// Strip characters outside that range (e.g. ✓, emojis) to avoid corrupted glyphs.
const pdfSafe = (v: any): string => {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/[\u2192\u2794\u27A4]/g, "->")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\u0000-\u00FF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export function exportStatsPDF(title: string, sections: StatsSection[], filenameBase: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(pdfSafe(title), margin, margin);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(pdfSafe(`Exporté le ${new Date().toLocaleString("fr-FR")}`), margin, margin + 16);
  doc.setTextColor(0);

  let y = margin + 36;
  sections.forEach((sec) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    if (y > 780) { doc.addPage(); y = margin; }
    doc.text(pdfSafe(sec.title), margin, y);
    y += 6;
    autoTable(doc, {
      startY: y + 4,
      head: [sec.headers.map(pdfSafe)],
      body: sec.rows.map((r) => r.map(pdfSafe)),
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [26, 26, 26], textColor: 255 },
      alternateRowStyles: { fillColor: [247, 247, 245] },
    });
    // @ts-ignore – lastAutoTable est ajouté par le plugin
    y = (doc as any).lastAutoTable.finalY + 22;
  });

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`${filenameBase}_${stamp}.pdf`);
}
