import { useState } from "react";
import { Ico } from "./icons/index.jsx";
import HomePage      from "./pages/HomePage.jsx";
import ChatPage      from "./pages/ChatPage.jsx";
import MapPage       from "./pages/MapPage.jsx";
import SchemesPage   from "./pages/SchemesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

const TABS = [
  { id: "home",      lbl: "Home",       I: Ico.Globe },
  { id: "chat",      lbl: "AI Assistant",  I: Ico.Bot },
  { id: "map",       lbl: "Zoning Map",    I: Ico.Map },
  { id: "schemes",   lbl: "Schemes",       I: Ico.Star },
  { id: "dashboard", lbl: "Dashboard",     I: Ico.Bar },
];

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      {/* ── Top chrome navigation ── */}
      <nav className="chrome">
        <div className="brand" onClick={() => setPage("home")}>
          <div className="brand-mark"><Ico.Civic /></div>
          <div>
            <div className="brand-name">CivicSense</div>
            <div className="brand-sub">Nashik · Maharashtra</div>
          </div>
        </div>

        <div className="nav-pills">
          {TABS.map(t => (
            <div
              key={t.id}
              className={`npill ${page === t.id ? "on" : ""}`}
              onClick={() => setPage(t.id)}
            >
              <t.I /><span>{t.lbl}</span>
            </div>
          ))}
        </div>

        <div className="chrome-r">
          <div className="cmdk">
            <Ico.Search /><span>Search…</span><kbd>⌘K</kbd>
          </div>
          <button className="cbtn"><Ico.Bell /><div className="pip" /></button>
          <button className="cbtn"><Ico.Sun /></button>
          <div className="av">RK</div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="view">
        {page === "home"      && <HomePage      onNavigate={setPage} />}
        {page === "chat"      && <ChatPage />}
        {page === "map"       && <MapPage />}
        {page === "schemes"   && <SchemesPage />}
        {page === "dashboard" && <DashboardPage />}
      </div>
    </div>
  );
}
