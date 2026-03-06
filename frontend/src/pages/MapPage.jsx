import { useState } from "react";
import { Ico } from "../icons/index.jsx";
import { ZONES_DATA, ZTYPES } from "../data/index.js";

export default function MapPage() {

const [sel, setSel] = useState(null);
const [filt, setFilt] = useState("All");

const filters = ["All", ...Object.keys(ZTYPES)];

const visible =
filt === "All"
? ZONES_DATA
: ZONES_DATA.filter(z => z.type === filt);

return ( <div className="map-shell">

```
  <div className="map-bg" />
  <div className="map-grid" />

  {visible.map(z => (

    <div
      key={z.id}
      className="zone"
      onClick={() => setSel(sel?.id === z.id ? null : z)}
      style={{
        left: `${z.x}%`,
        top: `${z.y}%`,
        width: `${z.w}%`,
        height: `${z.h}%`,
        background: `${z.color}33`,
        border: `1.5px solid ${z.color}88`
      }}
    >

      <div className="zlbl">

        <div className="ztype">
          {z.type.split(" ")[0]}
        </div>

        <div className="zname">
          {z.name.split(" ").slice(0,2).join(" ")}
        </div>

      </div>

    </div>

  ))}

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

  <div className="map-leg">

    <div className="leg-hd">
      Zone Classification
    </div>

    {Object.entries(ZTYPES).map(([t,c]) => (

      <div key={t} className="leg-row">

        <div
          className="leg-dot"
          style={{ background:c }}
        />

        {t}

      </div>

    ))}

  </div>

  <div className="map-coords">
    20.0059° N · 73.7898° E · Nashik MH · {visible.length} active
  </div>

  {sel && (

    <div className="zpanel">

      <div
        style={{
          display:"flex",
          justifyContent:"space-between",
          marginBottom:18
        }}
      >

        <div>

          <div
            style={{
              fontFamily:"'Syne',sans-serif",
              fontSize:17,
              fontWeight:700,
              color:"var(--white)",
              marginBottom:8
            }}
          >
            {sel.name}
          </div>

          <span
            style={{
              padding:"4px 11px",
              borderRadius:7,
              fontSize:11,
              fontWeight:700,
              background:`${sel.color}22`,
              color:sel.color,
              border:`1px solid ${sel.color}44`
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
