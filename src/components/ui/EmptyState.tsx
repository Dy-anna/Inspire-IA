import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; fn: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: "72px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: "#F1F1EF",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={24} color="#AFAFAC" />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{title}</p>
      {description && (
        <p style={{ fontSize: 14, color: "#787774", maxWidth: 380, margin: 0 }}>{description}</p>
      )}
      {action && (
        <Button variant="secondary" onClick={action.fn} style={{ marginTop: 4 }}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
