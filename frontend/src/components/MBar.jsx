// ── MBar — mini bar chart ────────────────────────────────────────
export default function MBar({ data }) {
  const mx = Math.max(...data.map(d => d.v));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%",
            height: (d.v / mx) * 68,
            background: i % 2 === 0
              ? "linear-gradient(to top,#1d8cf8,#0066cc)"
              : "linear-gradient(to top,#00c48c,#009966)",
            borderRadius: "5px 5px 0 0",
            opacity: 0.9,
            transition: "height 1.2s cubic-bezier(.4,0,.2,1)",
          }} />
          <span style={{ fontSize: 9, color: "var(--white3)", fontWeight: 500 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}
