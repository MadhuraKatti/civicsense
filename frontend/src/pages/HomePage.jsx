import { useState, useEffect } from "react";
import { Ico } from "../icons/index.jsx";
import AnimatedLogo from "../components/AnimatedLogo.jsx";

export default function HomePage({ onNavigate }) {
  const [demoTab,  setDemoTab]  = useState("chat");
  const [tutStep,  setTutStep]  = useState(0);
  const [counter,  setCounter]  = useState({ queries: 0, zones: 0, schemes: 0, cities: 0 });
  const [chatStep, setChatStep] = useState(0);

  // Animate counters on mount
  useEffect(() => {
    const targets = { queries: 12847, zones: 847, schemes: 234, cities: 18 };
    const duration = 1800, steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCounter({
        queries: Math.round(targets.queries * ease),
        zones:   Math.round(targets.zones   * ease),
        schemes: Math.round(targets.schemes * ease),
        cities:  Math.round(targets.cities  * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle demo chat messages
  useEffect(() => {
    if (demoTab !== "chat") return;
    if (chatStep >= 4) return;
    const t = setTimeout(() => setChatStep(s => s + 1), 900);
    return () => clearTimeout(t);
  }, [demoTab, chatStep]);

  useEffect(() => {
    if (demoTab === "chat") setChatStep(0);
  }, [demoTab]);

  const DEMO_TABS = [
    { id: "chat",      label: "AI Assistant",      icon: <Ico.Bot /> },
    { id: "map",       label: "Zoning Map",         icon: <Ico.Map /> },
    { id: "schemes",   label: "Scheme Eligibility", icon: <Ico.Star /> },
    { id: "dashboard", label: "Dashboard",          icon: <Ico.Bar /> },
  ];

  const TUT_STEPS = [
    {
      num: "01", title: "Ask the AI Assistant", sub: "Natural language civic queries",
      preview: {
        title: "How to use AI Policy Assistant",
        desc:  "Simply type any civic question in plain language. The AI understands zoning, policies, permits, and government schemes.",
        steps: [
          "Type your question in the chat input — e.g. 'Can I build a 3-floor building in Zone R2?'",
          "The AI cross-references Maharashtra DCR 2017 and NMC Bye-Laws in real time",
          "Receive structured responses with rules, permits, and official citations",
          "Click any citation to open the source document",
        ],
        tip: "You can ask follow-up questions in the same conversation — the AI remembers context from earlier in the chat.",
      }
    },
    {
      num: "02", title: "Explore Zoning Map", sub: "Visual geographic intelligence",
      preview: {
        title: "How to use Zoning Intelligence Map",
        desc:  "Explore Nashik's zoning districts interactively. Click any zone to see detailed regulations instantly.",
        steps: [
          "Use the floating search bar to find a specific locality or zone",
          "Filter zones by type: Residential, Commercial, Industrial, Mixed Use, or Restricted",
          "Click any colored zone to open the detail panel on the right",
          "Use 'Ask AI' inside the panel for deeper policy analysis on that zone",
        ],
        tip: "Hold Shift and click multiple zones to compare their regulations side-by-side in the detail panel.",
      }
    },
    {
      num: "03", title: "Check Scheme Eligibility", sub: "AI-matched government schemes",
      preview: {
        title: "How to check your eligibility",
        desc:  "Fill in your profile — age, income, occupation, city — and the AI matches you with every applicable government scheme.",
        steps: [
          "Complete the eligibility form with your personal and financial details",
          "Click 'Analyse My Eligibility' to trigger AI matching",
          "Scheme cards appear with a match percentage score for each scheme",
          "Click 'Apply Now' on any scheme to visit the official portal",
        ],
        tip: "The match percentage is AI-calculated based on official eligibility criteria for each scheme — a score above 70% means you're very likely eligible.",
      }
    },
    {
      num: "04", title: "Monitor Authority Dashboard", sub: "Real-time civic analytics",
      preview: {
        title: "How to use the Authority Dashboard",
        desc:  "Track platform-wide usage, query trends, and citizen activity across Maharashtra in real time.",
        steps: [
          "View today's total query count across all 4 platform modules",
          "Monitor daily query trend via the sparkline chart",
          "Track which policies and zones are most queried by citizens",
          "Filter and search the recent queries table by category or location",
        ],
        tip: "Export any dashboard view as a PDF report using the Export button in the top-right of the dashboard page.",
      }
    },
  ];

  const FEATURES = [
    { icon: <Ico.Bot />,    grad: "linear-gradient(135deg,#1d8cf8,#0066cc)", glow: "rgba(29,140,248,0.35)", title: "AI Policy Assistant",   desc: "Natural language interface to Maharashtra Development Control Rules, NMC Bye-Laws, and government policy documents.",                                              tags: ["NLP","Real-time","Cited Responses"] },
    { icon: <Ico.Map />,    grad: "linear-gradient(135deg,#00c48c,#009966)", glow: "rgba(0,196,140,0.35)",  title: "Zoning Intelligence",    desc: "Interactive geographic map of Nashik with color-coded zoning districts, FAR limits, height rules, and permit requirements.",                               tags: ["Interactive Map","6 Zone Types","Live Data"],   gtag: true },
    { icon: <Ico.Star />,   grad: "linear-gradient(135deg,#1d8cf8,#00c48c)", glow: "rgba(0,196,140,0.3)",   title: "Scheme Eligibility",     desc: "AI-powered matching engine that analyses your profile against every active central and state government scheme.",                                           tags: ["Profile Matching","234 Schemes","Auto-Ranked"], gtag: true },
    { icon: <Ico.Bar />,    grad: "linear-gradient(135deg,#9b7fea,#1d8cf8)", glow: "rgba(155,127,234,0.35)",title: "Authority Dashboard",    desc: "Real-time analytics console for government officials — query trends, zone popularity, scheme interest, and citizen activity.",                           tags: ["Bento Grid","Live Charts","Export-Ready"] },
    { icon: <Ico.Globe />,  grad: "linear-gradient(135deg,#00c48c,#1d8cf8)", glow: "rgba(29,140,248,0.3)",  title: "Multi-City Ready",       desc: "Platform architecture designed to scale across all 18 Maharashtra municipal corporations with localized policy data.",                                    tags: ["18 Cities","State-wide","Extensible"] },
    { icon: <Ico.Shield />, grad: "linear-gradient(135deg,#1d8cf8,#00c48c)", glow: "rgba(0,196,140,0.3)",   title: "Trusted Data Sources",   desc: "All responses cite official Maharashtra government documents — DCR 2017, NMC Bye-Laws, RERA, and UDPFI guidelines.",                                     tags: ["Official Sources","Cited","Auditable"] },
  ];

  // ── Demo content renderer ──────────────────────────────────────
  const renderDemoContent = () => {
    if (demoTab === "chat") {
      const msgs = [
        { role: "user", txt: "What are the FAR limits for a residential plot in Nashik?" },
        { role: "ai",   txt: null, rules: ["FAR capped at 1.5× for R2/R3 residential zones in Nashik","TDR permitted up to 0.4× base FAR on eligible plots","Corner plots get 10% additional FAR relaxation under NMC rules"] },
        { role: "user", txt: "What permits do I need for construction?" },
        { role: "ai",   txt: "You'll need: (1) Building Permission from NMC, (2) Structural Stability Certificate, and (3) Fire NOC for buildings above G+3." },
      ];
      return (
        <div className="chat-demo">
          {msgs.slice(0, chatStep + 1).map((m, i) => (
            <div key={i} className={`cd-msg ${m.role === "user" ? "u" : ""}`}>
              <div className={`cd-av ${m.role}`}>{m.role === "ai" ? <Ico.Sparkle /> : "RK"}</div>
              <div className={`cd-bub ${m.role}`}>
                {m.txt && <div style={{ color: m.role === "user" ? "#fff" : "var(--white)" }}>{m.txt}</div>}
                {m.rules && <>
                  <div style={{ marginBottom: 8, fontSize: 12, color: "var(--white)" }}>Based on MH DCR 2017 and NMC Bye-Laws:</div>
                  {m.rules.map((r, j) => (
                    <div key={j} className="cd-rule"><div className="cdr-dot" />{r}</div>
                  ))}
                </>}
              </div>
            </div>
          ))}
          {chatStep < msgs.length - 1 && (
            <div style={{ display: "flex", gap: 10 }}>
              <div className="cd-av ai"><Ico.Sparkle /></div>
              <div className="cd-bub ai" style={{ padding: "12px 14px" }}>
                <span className="tdot" /><span className="tdot" /><span className="tdot" />
              </div>
            </div>
          )}
        </div>
      );
    }

    if (demoTab === "map") {
      const mzones = [
        { color: "#1d8cf8", x: "8%",  y: "20%", w: "22%", h: "25%", lbl: "Residential" },
        { color: "#00c48c", x: "36%", y: "12%", w: "20%", h: "32%", lbl: "Commercial" },
        { color: "#f5a623", x: "62%", y: "18%", w: "20%", h: "35%", lbl: "Industrial" },
        { color: "#9b7fea", x: "30%", y: "52%", w: "24%", h: "26%", lbl: "Mixed Use" },
        { color: "#f06b6b", x: "8%",  y: "55%", w: "16%", h: "28%", lbl: "Restricted" },
      ];
      return (
        <div className="map-demo">
          <div className="md-grid" />
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
            <line x1="0" y1="45%" x2="100%" y2="45%" stroke="rgba(29,140,248,.08)" strokeWidth="2" />
            <line x1="35%" y1="0" x2="35%" y2="100%" stroke="rgba(29,140,248,.06)" strokeWidth="1.5" />
          </svg>
          {mzones.map((z, i) => (
            <div key={i} className="md-zone" style={{ left: z.x, top: z.y, width: z.w, height: z.h, background: z.color + "33", border: `1.5px solid ${z.color}88`, zIndex: 3 }}>
              <div className="md-zlbl">{z.lbl}</div>
            </div>
          ))}
          <div className="md-panel" style={{ zIndex: 10 }}>
            <div className="md-panel-title">Gangapur Road</div>
            {[["Zone Type","Commercial"],["Max Height","18m (G+5)"],["FAR","2.5×"],["Permits","3 required"]].map(([l, v]) => (
              <div key={l} className="md-prop">
                <span className="md-prop-lbl">{l}</span>
                <span className="md-prop-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (demoTab === "schemes") {
      return (
        <div className="schemes-demo">
          <div className="sd-form">
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 14 }}>Your Profile</div>
            {[["Age Range","26–35"],["Annual Income","₹3L–₹6L"],["Occupation","Salaried"],["City","Nashik"]].map(([l, v]) => (
              <div key={l} className="sd-field">
                <div className="sd-flbl">{l}</div>
                <input className="sd-input" readOnly value={v} />
              </div>
            ))}
            <button className="sd-btn">Analyse Eligibility →</button>
          </div>
          <div className="sd-results">
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--white)", marginBottom: 10 }}>4 Schemes Matched</div>
            {[
              { n: "PM Awas Yojana (PMAY)", s: 92, c: "var(--green)" },
              { n: "PM Mudra Yojana",       s: 78, c: "var(--green)" },
              { n: "MHADA Housing",         s: 65, c: "var(--blue2)" },
            ].map((sc, i) => (
              <div key={i} className="sd-card" style={{ animationDelay: `${i * 0.1}s`, borderLeftColor: sc.c }}>
                <div className="sd-card-name">{sc.n}</div>
                <div className="sd-bar"><div className="sd-bar-fill" style={{ width: `${sc.s}%`, background: sc.c }} /></div>
                <div style={{ fontSize: 11, color: "var(--white3)" }}>{sc.s}% match</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (demoTab === "dashboard") {
      const barH = [72, 88, 65, 94, 100, 82, 95];
      return (
        <div className="dash-demo">
          {[
            { n: "12,847", l: "Total Queries", d: "+18%" },
            { n: "5,234",  l: "Policy Qs",     d: "+12%" },
            { n: "4,102",  l: "Zone Lookups",  d: "+24%" },
            { n: "3,511",  l: "Schemes",       d: "+9%"  },
          ].map((s, i) => (
            <div key={i} className="dd-stat">
              <div className="dd-stat-n">{s.n}</div>
              <div className="dd-stat-l">{s.l}</div>
              <div className="dd-stat-d">{s.d}</div>
            </div>
          ))}
          <div className="dd-chart">
            <div className="dd-chart-title">Daily Citizen Queries — last 7 days</div>
            <div className="dd-bars">
              {barH.map((h, i) => (
                <div key={i} className="dd-bar" style={{
                  height: `${h}%`,
                  background: i % 2 === 0
                    ? "linear-gradient(to top,#1d8cf8,#0066cc)"
                    : "linear-gradient(to top,#00c48c,#009966)",
                  opacity: 0.85,
                }} />
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  const ts = TUT_STEPS[tutStep];

  return (
    <div className="home">
      <div className="home-bg" />

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-grid" />
        <div className="hero-eyebrow">India's First AI-Powered Civic Intelligence Platform</div>

        <AnimatedLogo size={180} />

        <h1 className="hero-title">
          Understand your city's<br />
          <span className="b">zoning</span>, <span className="g">schemes</span> &amp; policies<br />
          with AI
        </h1>
        <p className="hero-sub">
          CivicSense translates complex government regulations, zoning maps, and scheme eligibility into clear, actionable answers — instantly.
        </p>

       

        {/* Animated stats ticker */}
        <div className="stats-ticker">
          <div className="ticker-item">
            <div className="ticker-val blue">{counter.queries.toLocaleString()}</div>
            <div className="ticker-lbl">Queries Answered</div>
          </div>
          <div className="ticker-sep" />
          <div className="ticker-item">
            <div className="ticker-val green">{counter.zones.toLocaleString()}</div>
            <div className="ticker-lbl">Zones Mapped</div>
          </div>
          <div className="ticker-sep" />
          <div className="ticker-item">
            <div className="ticker-val">{counter.schemes}</div>
            <div className="ticker-lbl">Active Schemes</div>
          </div>
          <div className="ticker-sep" />
          <div className="ticker-item">
            <div className="ticker-val green">{counter.cities}</div>
            <div className="ticker-lbl">Maharashtra Cities</div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="section">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Platform Overview</div>
          <div className="section-title" style={{ textAlign: "center" }}>How CivicSense Works</div>
          <div className="section-sub" style={{ textAlign: "center", margin: "0 auto 0" }}>
            Four powerful tools, one unified platform for civic intelligence
          </div>
        </div>
        <div className="how-grid">
          {[
            { n: "1", t: "Ask a Question",    d: "Type any civic query in plain English — about zoning, permits, policies, or government schemes" },
            { n: "2", t: "AI Analysis",       d: "Our engine cross-references Maharashtra DCR, NMC Bye-Laws, and official policy documents in real time" },
            { n: "3", t: "Structured Answer", d: "Receive clear, cited responses with regulations, permit checklists, and official source references" },
            { n: "4", t: "Take Action",       d: "Apply for schemes, verify zone rules, or share the information with your legal or architecture team" },
          ].map((c, i) => (
            <div key={i} className="how-card" data-arrow={i < 3 ? "→" : ""}>
              <div className="how-num">{c.n}</div>
              <div className="how-title">{c.t}</div>
              <div className="how-desc">{c.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LIVE FEATURE DEMOS ── */}
      <div className="section">
        <div className="section-label">Interactive Demo</div>
        <div className="section-title">See it in action</div>
        <div className="section-sub">Click any tab below to see a live preview of each platform feature.</div>

        <div className="demo-tabs">
          {DEMO_TABS.map(t => (
            <div key={t.id} className={`dtab ${demoTab === t.id ? "on" : ""}`} onClick={() => setDemoTab(t.id)}>
              {t.icon} {t.label}
            </div>
          ))}
        </div>

        <div className="demo-window">
          <div className="demo-toolbar">
            <div className="dtb-dots">
              <div className="dtb-dot" style={{ background: "#f06b6b" }} />
              <div className="dtb-dot" style={{ background: "#f5a623" }} />
              <div className="dtb-dot" style={{ background: "#00c48c" }} />
            </div>
            <div className="dtb-url">civicsense.in/{demoTab}</div>
          </div>
          {renderDemoContent()}
        </div>
      </div>

      {/* ── CAPABILITIES GRID ── */}
      <div className="section">
        <div className="section-label">Platform Capabilities</div>
        <div className="section-title">Everything you need to understand your city</div>
        <div className="section-sub">Built on official Maharashtra government data, updated continuously.</div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card">
              <div className="feat-icon" style={{
  background: `linear-gradient(135deg,${f.glow.replace("0.35","0.15")},${f.glow.replace("0.35","0.08")})`,
  border: `1px solid ${f.glow.replace("0.35","0.3")}`,
}}>
  {f.icon}
</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
              <div className="feat-tags">
                {f.tags.map((t, j) => (
                  <span key={j} className={`ftag ${j === 1 && f.gtag ? "g" : ""}`}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TUTORIALS ── */}
      <div className="section">
        <div className="section-label">Tutorials</div>
        <div className="section-title">Step-by-step guides</div>
        <div className="section-sub">Learn how to get the most out of each platform feature.</div>

        <div className="tutorial-wrap">
          <div className="tut-steps">
            {TUT_STEPS.map((s, i) => (
              <div key={i} className={`tut-step ${tutStep === i ? "on" : ""}`} onClick={() => setTutStep(i)}>
                <div className="tst-num">Step {s.num}</div>
                <div className="tst-title">{s.title}</div>
                <div className="tst-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="tut-preview" key={tutStep}>
            <div className="demo-toolbar">
              <div className="dtb-dots">
                <div className="dtb-dot" style={{ background: "#f06b6b" }} />
                <div className="dtb-dot" style={{ background: "#f5a623" }} />
                <div className="dtb-dot" style={{ background: "#00c48c" }} />
              </div>
              <div className="dtb-url">Tutorial — {ts.preview.title}</div>
            </div>
            <div className="tp-inner">
              <div className="tp-title">{ts.preview.title}</div>
              <div className="tp-desc">{ts.preview.desc}</div>
              <div className="tp-step-list">
                {ts.preview.steps.map((step, i) => (
                  <div key={i} className="tp-step">
                    <div className="tp-step-n">{i + 1}</div>
                    <div className="tp-step-text">{step}</div>
                  </div>
                ))}
              </div>
              <div className="tp-visual">
                <div style={{ fontSize: 12, color: "var(--blue2)", fontWeight: 600, marginBottom: 8 }}>💡 Pro Tip</div>
                <div style={{ fontSize: 12.5, color: "var(--white3)", lineHeight: 1.6 }}>{ts.preview.tip}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA BAND ── */}
      <div style={{ padding: "0 24px 0", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div className="cta-band">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <AnimatedLogo size={80} />
            </div>
            <div className="cta-title">Start exploring CivicSense</div>
            <div className="cta-sub">
              Ask your first question, explore zoning maps, or check your scheme eligibility — completely free.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => onNavigate("chat")}>
                <Ico.Bot /> Open AI Assistant
              </button>
              <button className="btn-secondary" onClick={() => onNavigate("schemes")}>
                <Ico.Star /> Check Scheme Eligibility
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 60 }} />
    </div>
  );
}
