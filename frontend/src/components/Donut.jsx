// ── Donut — SVG pie/donut chart ──────────────────────────────────
export default function Donut({ data }) {
  const tot = data.reduce((s, d) => s + d.v, 0);
  let off = 0;
  const segs = data.map(d => { const s = { ...d, off }; off += d.v / tot; return s; });

  const arc = s => {
    const a1 = s.off * 2 * Math.PI - Math.PI / 2;
    const a2 = (s.off + s.v / tot) * 2 * Math.PI - Math.PI / 2;
    const r  = 36;
    const la = s.v / tot > 0.5 ? 1 : 0;
    return `M50,50 L${50 + r * Math.cos(a1)},${50 + r * Math.sin(a1)} A${r},${r} 0 ${la} 1 ${50 + r * Math.cos(a2)},${50 + r * Math.sin(a2)} Z`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
      <svg viewBox="0 0 100 100" style={{ width: 100, height: 100, flexShrink: 0 }}>
        {segs.map((s, i) => <path key={i} d={arc(s)} fill={s.c} opacity={0.9} />)}
        <circle cx={50} cy={50} r={21} fill="var(--navy2)" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: d.c, flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: "var(--white)", fontWeight: 500 }}>{d.l}</span>
            <span style={{ fontSize: 10.5, color: "var(--white3)", marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(d.v / tot * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
