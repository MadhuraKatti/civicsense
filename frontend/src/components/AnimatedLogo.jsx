export default function AnimatedLogo({ size = 180, showName = false }) {
  const s = size;
  // All measurements are proportional to size
  const ring = (inset, color, delay, shadow) => ({
    position: "absolute",
    inset,
    borderRadius: "50%",
    border: `${Math.max(1, s * 0.008)}px solid ${color}`,
    animation: "ringPulse 3s ease-in-out infinite",
    animationDelay: `${delay}s`,
    boxShadow: shadow || "none",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: s * 0.067 }}>
      <div style={{ position: "relative", width: s, height: s, flexShrink: 0 }}>

        {/* Pulsing rings */}
        <div style={ring(0, "rgba(26,126,240,0.5)", 0, `0 0 ${s*0.17}px rgba(26,126,240,0.12)`)} />
        <div style={ring(s * 0.1, "rgba(0,176,122,0.45)", 0.4, `0 0 ${s*0.11}px rgba(0,176,122,0.1)`)} />
        <div style={ring(s * 0.2, "rgba(26,126,240,0.35)", 0.8)} />

        {/* Spinning dashed orbit rings */}
        <div style={{
          position: "absolute", inset: s * 0.044, borderRadius: "50%",
          border: `${Math.max(1, s*0.008)}px dashed rgba(29,140,248,0.25)`,
          animation: "spinSlow 18s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: s * 0.122, borderRadius: "50%",
          border: `${Math.max(1, s*0.006)}px dashed rgba(0,196,140,0.2)`,
          animation: "spinSlow 12s linear infinite reverse",
        }} />

        {/* Orbital dots — use CSS animation so they orbit correctly */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[
            { color: "var(--blue2,#1a7ef0)", shadow: "var(--blue,#1a7ef0)", delay: "0s" },
            { color: "var(--green2,#00c48c)", shadow: "var(--green,#00b07a)", delay: "1.33s" },
            { color: "var(--blue2,#1a7ef0)", shadow: "var(--blue,#1a7ef0)", delay: "2.66s" },
          ].map((dot, i) => (
            <div key={i} style={{
              position: "absolute",
              width: s * 0.039, height: s * 0.039,
              borderRadius: "50%",
              background: dot.color,
              boxShadow: `0 0 ${s * 0.056}px ${dot.shadow}`,
              animation: `orbit1 4s linear infinite`,
              animationDelay: dot.delay,
              transformOrigin: `${s * 0.5}px ${s * 0.5}px`,
              transform: `rotate(0deg) translateX(${s * 0.39}px)`,
            }} />
          ))}

          {/* Glowing core */}
          <div style={{
            position: "absolute",
            inset: s * 0.289,
            borderRadius: "50%",
            background: "linear-gradient(135deg,rgba(26,126,240,0.15),rgba(0,176,122,0.12))",
            border: `${Math.max(1, s*0.008)}px solid rgba(26,126,240,0.35)`,
            boxShadow: `0 ${s*0.022}px ${s*0.133}px rgba(26,126,240,0.2), inset 0 1px 0 rgba(255,255,255,0.6)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "coreGlow 2.5s ease-in-out infinite",
          }}>
            <svg width={s * 0.26} height={s * 0.26} viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round">
              <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h1M9 13h1M9 17h1M14 13h1M14 17h1" />
            </svg>
          </div>
        </div>
      </div>

      {showName && (
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: Math.max(s * 0.18, 13),
          letterSpacing: "-0.03em",
          lineHeight: 1,
          background: "linear-gradient(90deg,#1d8cf8 0%,#1d8cf8 50%,#00c48c 50%,#00c48c 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          userSelect: "none",
        }}>
          CIVICSENSE
        </div>
      )}
    </div>
  );
}
