// ── Spark — SVG sparkline chart ──────────────────────────────────
export default function Spark({ data, color, h = 90 }) {
  const mx = Math.max(...data);
  const mn = Math.min(...data);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * 100,
    93 - ((v - mn) / (mx - mn || 1)) * 86,
  ]);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `M${pts[0][0]},100 ${pts.map(([x, y]) => `L${x},${y}`).join(" ")} L${pts.at(-1)[0]},100 Z`;
  const gid = `sg${color.replace(/\W/g, "")}`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: h }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r="2.5" fill={color} />
    </svg>
  );
}
