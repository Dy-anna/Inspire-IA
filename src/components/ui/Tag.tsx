interface TagProps {
  label: string;
  bg: string;
  text: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function Tag({ label, bg, text, onClick }: TagProps) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 500,
        background: bg,
        color: text,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
        lineHeight: 1.5,
      }}
    >
      {label}
    </span>
  );
}

export default Tag;
