// ── AnimatedLogo — pulsing civic intelligence logo ───────────────
export default function AnimatedLogo({ size = 180 }) {
  return (
    <div className="logo-stage" style={{ width: size, height: size }}>
      {/* Pulsing concentric rings */}
      <div className="logo-ring logo-ring-1" />
      <div className="logo-ring logo-ring-2" />
      <div className="logo-ring logo-ring-3" />

      {/* Counter-rotating dashed orbit rings */}
      <div className="logo-spin-ring" />
      <div className="logo-spin-ring-2" />

      {/* Orbital dots */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="orb-dot" />
        <div className="orb-dot" />
        <div className="orb-dot" />

        {/* Glowing civic core */}
        <div className="orb-center">
          <div className="logo-core">
            <svg
              width={size * 0.26}
              height={size * 0.26}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={1.8}
              strokeLinecap="round"
            >
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h1M9 13h1M9 17h1M14 13h1M14 17h1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
