import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, style, ...props },
  ref,
) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>{label}</label>
      )}
      <input
        ref={ref}
        {...props}
        style={{
          padding: "8px 12px",
          border: `1px solid ${error ? "#C0392B" : "#E8E8E5"}`,
          borderRadius: 6,
          fontSize: 14,
          fontFamily: "Inter",
          color: "#1A1A1A",
          outline: "none",
          width: "100%",
          background: "#fff",
          transition: "border-color 0.15s",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#2383E2";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "#C0392B" : "#E8E8E5";
          props.onBlur?.(e);
        }}
      />
      {error && <span style={{ fontSize: 12, color: "#C0392B" }}>{error}</span>}
    </div>
  );
});

export default Input;
