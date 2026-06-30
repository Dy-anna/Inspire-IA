import { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  variant?: BtnVariant;
  children: ReactNode;
  style?: CSSProperties;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  disabled,
  type = "button",
  style = {},
  loading,
  ...rest
}: ButtonProps) {
  const styles: Record<BtnVariant, CSSProperties> = {
    primary: { background: "#1A1A1A", color: "#fff", border: "1px solid #1A1A1A" },
    secondary: { background: "#fff", color: "#1A1A1A", border: "1px solid #E8E8E5" },
    ghost: { background: "transparent", color: "#787774", border: "none" },
    danger: { background: "#FDE8E8", color: "#C0392B", border: "1px solid #FDE8E8" },
  };
  return (
    <button
      type={type}
      disabled={disabled || loading}
      {...rest}
      style={{
        ...styles[variant],
        padding: "7px 14px",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: "Inter",
        transition: "all 0.15s",
        opacity: disabled || loading ? 0.6 : 1,
        ...style,
      }}
    >
      {loading ? "..." : children}
    </button>
  );
}

export default Button;
