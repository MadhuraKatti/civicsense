import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, LayerGroup } from "react-leaflet";

// Default Nashik city center
const NASHIK_CENTER = [20.0059, 73.7898];
const DEFAULT_ZOOM  = 12;

// Severity → CivicSense brand color
const SEVERITY_COLOR = {
  high:   "#f06b6b",
  medium: "#f5a623",
  low:    "#00c48c",
};

// ── Auto-fit bounds when zones change ────────────────────────────
function BoundsController({ zones }) {
  const map = useMap();
  useMemo(() => {
    if (!zones || zones.length === 0) return;
    const lats = zones.map(z => z.lat);
    const lngs = zones.map(z => z.lng);
    const bounds = [
      [Math.min(...lats) - 0.01, Math.min(...lngs) - 0.01],
      [Math.max(...lats) + 0.01, Math.max(...lngs) + 0.01],
    ];
    map.fitBounds(bounds, { padding: [30, 30] });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// ── Zone circles layer ────────────────────────────────────────────
function ZoneMarkersLayer({ zones, filter, onSelect }) {
  const visible = filter === "All" ? zones : zones.filter(z => z.type === filter);
  return (
    <LayerGroup>
      {visible.map(z => (
        <CircleMarker
          key={z.id}
          center={[z.lat, z.lng]}
          radius={26}
          pathOptions={{
            color:       z.color,
            fillColor:   z.color,
            fillOpacity: 0.22,
            weight:      2,
            opacity:     0.85,
          }}
          eventHandlers={{
            click:     () => onSelect(z),
            mouseover: (e) => { e.target.setStyle({ fillOpacity: 0.45, weight: 3 }); },
            mouseout:  (e) => { e.target.setStyle({ fillOpacity: 0.22, weight: 2 }); },
          }}
        >
          <Popup className="cs-popup">
            <div className="csp-header" style={{ color: z.color }}>{z.type}</div>
            <div className="csp-title">{z.name}</div>
            <div className="csp-row"><span>FAR</span><b>{z.far}×</b></div>
            <div className="csp-row"><span>Max Height</span><b>{z.ht}</b></div>
            <div className="csp-row"><span>Permits</span><b>{z.permits.length} required</b></div>
          </Popup>
        </CircleMarker>
      ))}
    </LayerGroup>
  );
}

// ── Issue markers layer ───────────────────────────────────────────
function IssueMarkersLayer({ issues }) {
  return (
    <LayerGroup>
      {issues.map(issue => {
        const color = SEVERITY_COLOR[issue.severity] || "#1d8cf8";
        return (
          <CircleMarker
            key={issue.id}
            center={[issue.lat, issue.lng]}
            radius={9}
            pathOptions={{
              color:       color,
              fillColor:   color,
              fillOpacity: 0.85,
              weight:      2,
              opacity:     1,
            }}
            eventHandlers={{
              mouseover: (e) => { e.target.setStyle({ radius: 12, fillOpacity: 1 }); },
              mouseout:  (e) => { e.target.setStyle({ radius: 9,  fillOpacity: 0.85 }); },
            }}
          >
            <Popup className="cs-popup">
              <div className="csp-header" style={{ color }}>
                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} Severity
              </div>
              <div className="csp-title">{issue.title}</div>
              <div className="csp-desc">{issue.description}</div>
            </Popup>
          </CircleMarker>
        );
      })}
    </LayerGroup>
  );
}

// ── Main MapView export ───────────────────────────────────────────
export default function MapView({
  zones       = [],
  issues      = [],
  filter      = "All",
  showZones   = true,
  showIssues  = true,
  onSelectZone = () => {},
}) {
  return (
    <MapContainer
      center={NASHIK_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      className="cs-leaflet-map"
    >
      <BoundsController zones={zones} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      {showZones && (
        <ZoneMarkersLayer
          zones={zones}
          filter={filter}
          onSelect={onSelectZone}
        />
      )}

      {showIssues && (
        <IssueMarkersLayer issues={issues} />
      )}
    </MapContainer>
  );
}
