import React from "react";

const PALETTE = ["#2383E2","#1D7F42","#B35000","#C0392B","#6B3FA0","#0891B2","#7C3AED","#0F766E"];

function getColor(name: string): string {
  return PALETTE[(name?.charCodeAt(0) || 0) % PALETTE.length];
}

function getInitials(name: string): string {
  return (name || "?").split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

interface AvatarProps {
  name?: string;
  size?: number;
  src?: string | null;
  color?: string;
}

export function Avatar({ name = "", size = 32, src = null, color }: AvatarProps) {
  const bg = color || getColor(name);
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.round(size * 0.36), fontWeight: 700, flexShrink: 0, userSelect: "none" }}>
      {getInitials(name)}
    </div>
  );
}

export default Avatar;

export { getColor as avatarColor, getInitials as avatarInitials };
