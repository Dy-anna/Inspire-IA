export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 42,
            borderBottom: "1px solid #E8E8E5",
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 160,
              height: 14,
              background: "#F1F1EF",
              borderRadius: 4,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: 100,
              height: 14,
              background: "#F1F1EF",
              borderRadius: 4,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: 80,
              height: 22,
              background: "#F1F1EF",
              borderRadius: 4,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function LoadingScreen({ label = "Chargement..." }: { label?: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F7F5",
        color: "#787774",
        fontSize: 14,
        fontFamily: "Inter",
      }}
    >
      {label}
    </div>
  );
}
