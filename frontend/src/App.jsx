import { useState, useEffect } from "react";
import { Ico } from "./icons/index.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import SearchModal from "./components/SearchModal.jsx";
import AlertsDropdown, { useUnreadCount } from "./components/AlertsDropdown.jsx";
import AccountPopover from "./components/AccountPopover.jsx";
import AnimatedLogo from "./components/AnimatedLogo.jsx";
import HomePage      from "./pages/HomePage.jsx";
import ChatPage      from "./pages/ChatPage.jsx";
import MapPage       from "./pages/MapPage.jsx";
import SchemesPage   from "./pages/SchemesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage     from "./pages/LoginPage.jsx";
import SignupPage    from "./pages/SignupPage.jsx";

const TABS = [
  { id: "home",      lbl: "Home",         I: Ico.Globe },
  { id: "chat",      lbl: "AI Assistant", I: Ico.Bot },
  { id: "map",       lbl: "Zoning Map",   I: Ico.Map },
  { id: "schemes",   lbl: "Schemes",      I: Ico.Star },
  { id: "dashboard", lbl: "Dashboard",    I: Ico.Bar },
];

const PROTECTED = ["chat", "map", "dashboard"];

function MoonIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ── Landing auth modal ──────────────────────────────────────────
function AuthModal({ onClose, onLogin }) {
  const { login, signup, loading, error, setError } = useAuth();
  const [tab, setTab]     = useState("login");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [conf, setConf]   = useState("");
  const [local, setLocal] = useState("");
  const [done, setDone]   = useState(false);

  async function handleLogin() {
    const ok = await login(email, pass);
    if (ok) onLogin();
  }

  async function handleSignup() {
    setLocal("");
    if (!name || !email || !pass || !conf) { setLocal("All fields required."); return; }
    if (pass.length < 6) { setLocal("Password must be ≥ 6 characters."); return; }
    if (pass !== conf)   { setLocal("Passwords don't match."); return; }
    const ok = await signup(name, email, pass);
    if (ok) { setDone(true); setTimeout(() => { setTab("login"); setDone(false); }, 1600); }
  }

  const err = local || error;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}><Ico.X /></button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 22 }}>
          <AnimatedLogo size={90} showName={true} />
          <div className="auth-modal-tagline">Civic intelligence for Nashik</div>
        </div>

        <div className="auth-modal-tabs">
          <button className={`amt ${tab === "login" ? "on" : ""}`} onClick={() => { setTab("login"); setError(null); setLocal(""); }}>Sign in</button>
          <button className={`amt ${tab === "signup" ? "on" : ""}`} onClick={() => { setTab("signup"); setError(null); setLocal(""); }}>Create account</button>
        </div>

        {err && (
          <div className="auth-error" style={{ marginBottom: 14 }} onClick={() => { setLocal(""); setError(null); }}>
            {err} <span>×</span>
          </div>
        )}

        {tab === "login" && !done && (
          <div className="auth-fields">
            <div className="auth-field"><label>Email</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <div className="auth-field"><label>Password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={pass}
                onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <button className="auth-btn" onClick={handleLogin} disabled={loading || !email || !pass}>
              {loading ? <span className="auth-spinner" /> : "Sign in"}
            </button>
            <div className="auth-hint">Sign in with your Supabase account or create one above.</div>
          </div>
        )}

        {tab === "signup" && !done && (
          <div className="auth-fields">
            {[
              { label: "Full Name", val: name, set: setName, type: "text", ph: "Raj Kumar" },
              { label: "Email", val: email, set: setEmail, type: "email", ph: "raj@example.com" },
              { label: "Password", val: pass, set: setPass, type: "password", ph: "Min 6 chars" },
              { label: "Confirm Password", val: conf, set: setConf, type: "password", ph: "Repeat password" },
            ].map(({ label, val, set, type, ph }) => (
              <div className="auth-field" key={label}><label>{label}</label>
                <input className="auth-input" type={type} placeholder={ph} value={val}
                  onChange={e => set(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} />
              </div>
            ))}
            <button className="auth-btn" onClick={handleSignup} disabled={loading}>
              {loading ? <span className="auth-spinner" /> : "Create account"}
            </button>
          </div>
        )}

        {done && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
            <div className="auth-title">Account created!</div>
            <div className="auth-sub">Switching to sign in…</div>
          </div>
        )}

        <div className="auth-divider"><span>or</span></div>
        <button className="auth-btn-ghost" onClick={onClose}>Browse as Guest</button>
      </div>
    </div>
  );
}

// ── Main shell ─────────────────────────────────────────────────
function HamburgerIcon({ open }) {
  return (
    <div className={`hamburger ${open ? "open" : ""}`}>
      <span /><span /><span />
    </div>
  );
}

function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [page, setPage]             = useState("home");
  const [showSearch, setSearch]     = useState(false);
  const [showAlerts, setAlerts]     = useState(false);
  const [showAccount, setAccount]   = useState(false);
  const [showAuthModal, setAuthModal] = useState(false);
  const [mobileNav, setMobileNav]   = useState(false);
  const unread = useUnreadCount();

  // Show auth modal on first session load if not logged in
  useEffect(() => {
    const dismissed = sessionStorage.getItem("auth-modal-dismissed");
    if (!user && !dismissed) {
      const t = setTimeout(() => setAuthModal(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearch(s => !s); }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function dismissAuthModal() {
    sessionStorage.setItem("auth-modal-dismissed", "1");
    setAuthModal(false);
  }

  function navigate(dest) {
    if (PROTECTED.includes(dest) && !user) { setAuthModal(true); return; }
    setPage(dest);
    setMobileNav(false);
  }

  const displayName = user?.user_metadata?.full_name || user?.email || "";
  const initials = displayName
    ? displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : null;

  if (page === "login")  return <LoginPage  onNavigate={setPage} />;
  if (page === "signup") return <SignupPage onNavigate={setPage} />;

  return (
    <div className="app">
      <nav className="chrome">
        <div className="brand" onClick={() => { setPage("home"); setMobileNav(false); }}>
          <div className="brand-mark"><Ico.Civic /></div>
          <div>
            <div className="brand-name brand-name--gradient">CIVICSENSE</div>
            <div className="brand-sub">Nashik · Maharashtra</div>
          </div>
        </div>

        {/* Hamburger toggle — visible only on mobile via CSS */}
        <button className="mobile-menu-btn" onClick={() => setMobileNav(s => !s)} aria-label="Toggle navigation">
          <HamburgerIcon open={mobileNav} />
        </button>

        <div className={`nav-pills ${mobileNav ? "nav-pills--open" : ""}`}>
          {TABS.map(t => (
            <div key={t.id} className={`npill ${page === t.id ? "on" : ""}`} onClick={() => navigate(t.id)}>
              <t.I /><span>{t.lbl}</span>
              {PROTECTED.includes(t.id) && !user && <span className="pill-lock">🔒</span>}
            </div>
          ))}
        </div>

        <div className="chrome-r">
          <div className="cmdk" onClick={() => setSearch(true)}>
            <Ico.Search /><span>Search…</span><kbd>⌘K</kbd>
          </div>

          <div style={{ position: "relative" }}>
            <button className="cbtn" onClick={() => setAlerts(s => !s)}>
              <Ico.Bell />
              {unread > 0 && <div className="pip">{unread > 9 ? "9+" : unread}</div>}
            </button>
            {showAlerts && <AlertsDropdown onClose={() => setAlerts(false)} />}
          </div>

          <button className="cbtn" onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? <Ico.Sun /> : <MoonIcon />}
          </button>

          {/* Account button — always visible, shows popover */}
          <div style={{ position: "relative" }}>
            <div
              className={`av ${!user ? "av--guest" : ""}`}
              title={user ? displayName : "Sign in"}
              onClick={() => setAccount(s => !s)}
            >
              {user ? initials : <Ico.User />}
            </div>
            {showAccount && (
              <AccountPopover
                onClose={() => setAccount(false)}
                onOpenAuth={() => { dismissAuthModal(); setAuthModal(true); }}
              />
            )}
          </div>
        </div>
      </nav>

      <div className="view">
        {page === "home"      && <HomePage      onNavigate={navigate} />}
        {page === "chat"      && <ChatPage />}
        {page === "map"       && <MapPage />}
        {page === "schemes"   && <SchemesPage />}
        {page === "dashboard" && <DashboardPage />}
      </div>

      {showSearch && <SearchModal onClose={() => setSearch(false)} onNavigate={navigate} />}

      {showAuthModal && (
        <AuthModal
          onClose={dismissAuthModal}
          onLogin={() => setAuthModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
