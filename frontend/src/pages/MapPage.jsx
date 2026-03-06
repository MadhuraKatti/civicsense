import { useState } from "react";
import { Ico } from "../icons/index.jsx";
import { ZONES_DATA, ZTYPES } from "../data/index.js";

export default function MapPage() {
  const [sel, setSel] = useState(null);
  const [filt, setFilt] = useState("All");
  const [query, setQuery] = useState("");

  const filters = ["All", ...Object.keys(ZTYPES)];

  const visible = ZONES_DATA.filter(z => {
    const matchFilt = filt === "All" || z.type === filt;
    const matchQuery = !query || z.name.toLowerCase().includes(query.toLowerCase()) || z.type.toLowerCase().includes(query.toLowerCase());
    return matchFilt && matchQuery;
  });

  return (
    <div className="map-shell">
      <div className="map-bg" />
      <div className="map-grid" />

      {visible.map(z => (
        <div
          key={z.id}
          className={`zone ${sel?.id === z.id ? "zone--sel" : ""}`}
          onClick={() => setSel(sel?.id === z.id ? null : z)}
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
            background: `${z.color}33`,
            border: `1.5px solid ${z.color}88`,
          }}
        >
          <div className="zlbl">
            <div className="ztype">{z.type.split(" ")[0]}</div>
            <div className="zname">{z.name.split(" ").slice(0, 2).join(" ")}</div>
          </div>
        </div>
      ))}

      {/* Search + Filter Bar */}
      <div className="map-bar">
        <div className="msi">
          <Ico.Search />
          <input
            className="msinp"
            placeholder="Search zones, localities…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="mfilts">
          {filters.map(f => (
            <button
              key={f}
              className={`mfbtn ${filt === f ? "on" : ""}`}
              onClick={() => setFilt(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="map-leg">
        <div className="leg-hd">Zone Classification</div>
        {Object.entries(ZTYPES).map(([t, c]) => (
          <div key={t} className="leg-row">
            <div className="leg-dot" style={{ background: c }} />
            {t}
          </div>
        ))}
      </div>

      {/* Coords */}
      <div className="map-coords">
        20.0059° N · 73.7898° E · Nashik MH · {visible.length} active
      </div>

      {/* Zone Detail Panel */}
      {sel && (
        <div className="zpanel">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>
                {sel.name}
              </div>
              <span style={{ padding: "4px 11px", borderRadius: 7, fontSize: 11, fontWeight: 700, background: `${sel.color}22`, color: sel.color, border: `1px solid ${sel.color}44` }}>
                {sel.type}
              </span>
            </div>
            <button className="ib" onClick={() => setSel(null)}><Ico.X /></button>
          </div>

          {[
            ["Zone Type", sel.type],
            ["Max Height", sel.ht],
            ["Floor Area Ratio", `${sel.far}×`],
            ["Required Permits", sel.permits.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="zprop">
              <span style={{ color: "var(--white3)", fontSize: 13 }}>{k}</span>
              <b style={{ color: "var(--white)", fontSize: 13, textAlign: "right", maxWidth: "55%" }}>{v}</b>
            </div>
          ))}

          <button className="z-ask-btn">
            Ask AI About This Zone →
          </button>
        </div>
      )}
    </div>
  );
}
