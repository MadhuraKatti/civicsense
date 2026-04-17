import { useState, useEffect, useRef } from "react";
import { Ico } from "../icons/index.jsx";
import { searchQuery } from "../api/api";

const TYPE_META = {
  issue:    { label: "Issue",    color: "#f06b6b" },
  alert:    { label: "Alert",    color: "#f0a500" },
  scheme:   { label: "Scheme",   color: "#00b07a" },
  location: { label: "Location", color: "#1a7ef0" },
  zone:     { label: "Zone",     color: "#9b6bf0" },
};

const RECENT = [
  { id: "r1", type: "zone",   title: "Zone R2 regulations", description: "Residential zone building limits" },
  { id: "r2", type: "scheme", title: "PM Awas Yojana",      description: "Housing scheme eligibility" },
  { id: "r3", type: "issue",  title: "Nashik road repair",  description: "Gangapur Road pothole issues" },
];

export default function SearchModal({ onClose, onNavigate }) {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const debounce = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    clearTimeout(debounce.current);
    if (!query.trim()) { setResults([]); return; }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchQuery(query);
        setResults(data.results || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
  }, [query]);

  function handleKey(e) { if (e.key === "Escape") onClose(); }

  function handleResult(r) {
    const dest = r.type === "zone" ? "map" : r.type === "scheme" ? "schemes" : r.type === "alert" ? "dashboard" : "chat";
    onNavigate(dest);
    onClose();
  }

  const list  = query.trim() ? results : RECENT;
  const label = query.trim() ? "Results" : "Recent searches";

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()} onKeyDown={handleKey}>
        <div className="search-input-row">
          <Ico.Search />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search zones, schemes, issues, locations…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {loading && <div className="search-spin" />}
          {!loading && query && (
            <button className="search-clear" onClick={() => setQuery("")}><Ico.X /></button>
          )}
        </div>

        {list.length > 0 && (
          <div className="search-results">
            <div className="search-section-label">{label}</div>
            {list.map(r => {
              const meta = TYPE_META[r.type] || { label: r.type, color: "#888" };
              return (
                <div key={r.id} className="search-result-item" onClick={() => handleResult(r)}>
                  <span className="sr-badge" style={{ background: meta.color + "22", color: meta.color }}>{meta.label}</span>
                  <div className="sr-text">
                    <div className="sr-title">{r.title}</div>
                    <div className="sr-desc">{r.description}</div>
                  </div>
                  <Ico.ArrowR />
                </div>
              );
            })}
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div className="search-empty">No results for "<strong>{query}</strong>"</div>
        )}

        <div className="search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
