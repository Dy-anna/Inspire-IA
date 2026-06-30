import inspireLogo from "@/assets/inspire-ia-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  textColor?: string;
  withBackground?: boolean;
}

export function Logo({ size = "md", textColor = "#fff", withBackground = false }: LogoProps) {
  const imgSize = size === "sm" ? "w-11 h-11 md:w-12 md:h-12" : size === "lg" ? "w-14 h-14 md:w-16 md:h-16" : "w-12 h-12 md:w-14 md:h-14";
  const textSize = size === "sm" ? "text-lg md:text-xl" : size === "lg" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl";
  return (
    <div className="inline-flex items-center gap-3">
      <img
        src={inspireLogo}
        alt="Inspire IA"
        className={`${imgSize} shrink-0 object-contain`}
        style={{
          filter: "brightness(1.24) contrast(1.28) saturate(1.3) drop-shadow(0 0 2px rgba(255,255,255,0.88)) drop-shadow(0 0 12px rgba(245,158,11,0.58)) drop-shadow(0 0 22px rgba(59,130,246,0.52))",
        }}
      />
      <span
        className={`${textSize} font-extrabold tracking-tight`}
        style={{ color: textColor, letterSpacing: "-0.5px" }}
      >
        Inspire IA
      </span>
    </div>
  );
}
