import { useState } from "react";
import { Ico } from "../icons/index.jsx";
import { ZONES_DATA, ZTYPES, ISSUES_DATA } from "../data/index.js";
import MapView from "../components/MapView.jsx";

export default function MapPage() {

  const [sel,        setSel]        = useState(null);
  const [filt,       setFilt]       = useState("All");
  const [showZones,  setShowZones]  = useState(true);
  const [showIssues, setShowIssues] = useState(true);

  const filters = ["All", ...Object.keys(ZTYPES)];

  return (
    <div className="map-shell">

      {/* ── Leaflet map fills the same container  ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: "inherit", overflow: "hidden" }}>
        <MapView
          zones={ZONES_DATA}
          issues={ISSUES_DATA}
          filter={filt}
          showZones={showZones}
          showIssues={showIssues}
          onSelectZone={(z) => setSel(sel?.id === z.id ? null : z)}
        />
      </div>

      {/* ── Search + filter bar ── */}
      <div className="map-bar">

        <div className="msi">
          <Ico.Search />
          <input
            className="msinp"
            placeholder="Search zones, localities..."
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

      {/* ── Overlay toggles ── */}
      <div className="map-overlays">

        <div className="mo-label">Overlays</div>

        <button
          className={`mo-btn ${showZones ? "on" : ""}`}
          onClick={() => setShowZones(s => !s)}
          title="Toggle zone boundaries"
        >
          <Ico.Map />
          <span>Zones</span>
        </button>

        <button
          className={`mo-btn ${showIssues ? "on" : ""}`}
          onClick={() => setShowIssues(s => !s)}
          title="Toggle civic issue markers"
        >
          <Ico.Bell />
          <span>Issues</span>
        </button>

        <button className="mo-btn" title="Heatmap — coming soon" disabled>
          <Ico.Bar />
          <span>Heatmap</span>
        </button>

        <button className="mo-btn" title="AI Predictions — coming soon" disabled>
          <Ico.Sparkle />
          <span>AI Predict</span>
        </button>

      </div>

      {/* ── Zone legend ── */}
      <div className="map-leg">

        <div className="leg-hd">Zone Classification</div>

        {Object.entries(ZTYPES).map(([t, c]) => (
          <div key={t} className="leg-row">
            <div className="leg-dot" style={{ background: c }} />
            {t}
          </div>
        ))}

        <div className="leg-hd" style={{ marginTop: 12 }}>Issue Severity</div>
        {[["High", "#f06b6b"], ["Medium", "#f5a623"], ["Low", "#00c48c"]].map(([lbl, c]) => (
          <div key={lbl} className="leg-row">
            <div className="leg-dot" style={{ background: c }} />
            {lbl}
          </div>
        ))}

      </div>

      {/* ── Coordinates strip ── */}
      <div className="map-coords">
        20.0059° N · 73.7898° E · Nashik MH · {ZONES_DATA.filter(z => filt === "All" || z.type === filt).length} zones · {ISSUES_DATA.length} issues
      </div>

      {/* ── Zone detail panel ── */}
      {sel && (

        <div className="zpanel">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 18
            }}
          >

            <div>

              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "var(--white)",
                  marginBottom: 8
                }}
              >
                {sel.name}
              </div>

              <span
                style={{
                  padding: "4px 11px",
                  borderRadius: 7,
                  fontSize: 11,
                  fontWeight: 700,
                  background: `${sel.color}22`,
                  color: sel.color,
                  border: `1px solid ${sel.color}44`
                }}
              >
                {sel.type}
              </span>

            </div>

            <button className="ib" onClick={() => setSel(null)}>
              <Ico.X />
            </button>

          </div>

          <div className="zprop">
            <span>Zone Type</span>
            <b>{sel.type}</b>
          </div>

          <div className="zprop">
            <span>Max Height</span>
            <b>{sel.ht}</b>
          </div>

          <div className="zprop">
            <span>FAR</span>
            <b>{sel.far}×</b>
          </div>

          <div className="zprop">
            <span>Permits</span>
            <b>{sel.permits.length}</b>
          </div>

          <button className="z-ask-btn">
            Ask AI About This Zone →
          </button>

        </div>

      )}

    </div>
  );
}
