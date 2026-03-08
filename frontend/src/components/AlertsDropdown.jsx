import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const STORAGE_KEY = "civicsense-read-alerts";

const SEV_COLOR = { high: "#f06b6b", medium: "#f0a500", low: "#00b07a", info: "#1a7ef0" };

function getRead() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { return new Set(); }
}
function saveRead(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export default function AlertsDropdown({ onClose }) {
  const [alerts, setAlerts]   = useState([]);
  const [read, setRead]       = useState(getRead);
  const [loading, setLoading] = useState(true);
  const ref = useRef();

  useEffect(() => {
    fetch(`${API}/alerts`)
      .then(r => r.json())
      .then(d => setAlerts(d.alerts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  function markOne(id) {
    const next = new Set([...read, id]);
    setRead(next); saveRead(next);
  }

  function markAll() {
    const next = new Set(alerts.map(a => a.id));
    setRead(next); saveRead(next);
  }

  const unread = alerts.filter(a => !read.has(a.id)).length;

  return (
    <div className="alerts-dropdown" ref={ref}>
      <div className="ad-header">
        <span className="ad-title">Notifications</span>
        {unread > 0 && <span className="ad-badge">{unread}</span>}
        {unread > 0 && <button className="ad-mark-all" onClick={markAll}>Mark all read</button>}
      </div>

      <div className="ad-list">
        {loading && [1,2,3].map(i => (
          <div key={i} className="ad-skeleton" />
        ))}
        {!loading && alerts.map(a => (
          <div
            key={a.id}
            className={`ad-item ${read.has(a.id) ? "read" : ""}`}
            onClick={() => markOne(a.id)}
          >
            <div className="ad-sev" style={{ background: SEV_COLOR[a.severity] || "#888" }} />
            <div className="ad-body">
              <div className="ad-item-title">{a.title}</div>
              <div className="ad-item-desc">{a.description}</div>
              <div className="ad-meta">
                <span>{a.location}</span>
                <span className="ad-dot">·</span>
                <span>{a.timestamp}</span>
              </div>
            </div>
            {!read.has(a.id) && <div className="ad-unread-dot" />}
          </div>
        ))}
        {!loading && alerts.length === 0 && (
          <div className="ad-empty">No alerts at this time</div>
        )}
      </div>

      <div className="ad-footer">
        <span>Severity: </span>
        {Object.entries(SEV_COLOR).map(([k, c]) => (
          <span key={k} className="ad-sev-key">
            <span style={{ background: c, width: 8, height: 8, borderRadius: "50%", display: "inline-block" }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/alerts`)
      .then(r => r.json())
      .then(d => {
        const read = getRead();
        setCount((d.alerts || []).filter(a => !read.has(a.id)).length);
      })
      .catch(() => {});
  }, []);
  return count;
}
