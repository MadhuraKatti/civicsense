// ── Static data constants ────────────────────────────────────────

export const HIST = [
  { id: 1, t: "Commercial zoning in R2", d: "Just now" },
  { id: 2, t: "FAR limits in Nashik",    d: "Today" },
  { id: 3, t: "PMAY eligibility",        d: "Yesterday" },
  { id: 4, t: "Heritage zone rules",     d: "Mon" },
  { id: 5, t: "Industrial permits",      d: "Sun" },
];

export const INIT_MSGS = [
  {
    role: "user",
    txt: "Can I build a commercial building in Zone R2 in Nashik?",
    t: "10:32 AM",
  },
  {
    role: "ai",
    structured: {
      summary:
        "Zone R2 (Low-Density Residential) in Nashik primarily permits residential uses. Commercial construction is heavily restricted — only small neighbourhood-serving shops under 20 sq.m are permitted at ground floor level.",
      rules: [
        "Maximum height G+3 (~12 metres above finished ground level)",
        "Ground-floor neighbourhood shops ≤20 sq.m only",
        "FAR capped at 1.5×; TDR transferable up to 0.4× base FAR",
        "Minimum green coverage: 15% of plot area unpaved",
      ],
      permits: [
        "Building Permission — NMC Building Dept. (Form-A)",
        "Environmental Clearance if built-up >5,000 sq.m",
        "Fire Safety NOC — Nashik Fire Brigade (pre-sanction)",
      ],
      refs: [
        "MH DCR 2017 — Ch.4 §4.3",
        "NMC Building Bye-Laws 2019",
        "UDPFI Guidelines — R2 Classification",
      ],
    },
    t: "10:33 AM",
  },
];

export const ZONES_DATA = [
  { id: 1, name: "Nashik Road West", type: "Residential", color: "#1d8cf8", x: 13, y: 17, w: 22, h: 21, far: 1.5, ht: "12m (G+3)", permits: ["NMC Approval", "Structural NOC"] },
  { id: 2, name: "Gangapur Road",    type: "Commercial",  color: "#00c48c", x: 42, y: 13, w: 21, h: 27, far: 2.5, ht: "18m (G+5)", permits: ["Fire NOC", "Trade License", "NMC Approval"] },
  { id: 3, name: "Satpur MIDC",      type: "Industrial",  color: "#f5a623", x: 67, y: 22, w: 19, h: 33, far: 1.0, ht: "15m",       permits: ["MIDC Approval", "Pollution NOC"] },
  { id: 4, name: "College Road",     type: "Mixed Use",   color: "#9b7fea", x: 34, y: 50, w: 24, h: 22, far: 2.0, ht: "15m (G+4)", permits: ["NMC Approval", "Fire NOC"] },
  { id: 5, name: "Trimbak Road",     type: "Restricted",  color: "#f06b6b", x: 9,  y: 53, w: 17, h: 25, far: 0.5, ht: "7m (G+1)",  permits: ["Heritage Clearance"] },
  { id: 6, name: "Cidco New Nashik", type: "Residential", color: "#1d8cf8", x: 60, y: 61, w: 20, h: 20, far: 1.5, ht: "12m (G+3)", permits: ["NMC Approval"] },
];

export const ZTYPES = {
  Residential: "#1d8cf8",
  Commercial:  "#00c48c",
  Industrial:  "#f5a623",
  "Mixed Use": "#9b7fea",
  Restricted:  "#f06b6b",
};

export const SCHEMES_DATA = [
  { name: "PM Awas Yojana (PMAY)",    ministry: "Ministry of Housing & Urban Affairs", desc: "Credit-linked subsidy for first-time homebuyers from EWS/LIG/MIG categories.", score: 92, status: "likely",   benefit: "Subsidy up to ₹2.67 Lakh on home loan interest",            cat: "Housing",    dl: "Mar 2025" },
  { name: "PM Mudra Yojana",          ministry: "Ministry of Finance",                  desc: "Collateral-free micro-loans for non-farm small business activities.",          score: 78, status: "likely",   benefit: "Loans ₹50K–₹10 Lakh (Shishu/Kishore/Tarun)",               cat: "Business",   dl: "Ongoing" },
  { name: "MHADA Housing Lottery",    ministry: "Government of Maharashtra",            desc: "Affordable housing lottery for residents across income categories.",            score: 65, status: "possible", benefit: "Below-market-rate flats in prime Nashik locations",          cat: "Housing",    dl: "Jun 2025" },
  { name: "PM SVANidhi",              ministry: "Ministry of Housing & Urban Affairs", desc: "Working capital loans for street vendors and micro-entrepreneurs.",             score: 40, status: "unlikely", benefit: "₹10K–₹50K at subsidised interest rates",                   cat: "Livelihood", dl: "Dec 2024" },
  { name: "Startup India Seed Fund",  ministry: "DPIIT, Ministry of Commerce",         desc: "Financial assistance for early-stage startups — POC to market entry.",         score: 55, status: "possible", benefit: "Up to ₹20 Lakh grant + ₹50 Lakh investable corpus",         cat: "Business",   dl: "Ongoing" },
];

export const STATS_DATA = [
  { lbl: "Total Queries",    val: "12,847", d: "+18%", g: "linear-gradient(135deg,#1d8cf8,#0066cc)", ic: "Bot" },
  { lbl: "Policy Questions", val: "5,234",  d: "+12%", g: "linear-gradient(135deg,#00c48c,#0099cc)", ic: "File" },
  { lbl: "Zone Lookups",     val: "4,102",  d: "+24%", g: "linear-gradient(135deg,#9b7fea,#6644cc)", ic: "Map" },
  { lbl: "Scheme Searches",  val: "3,511",  d: "+9%",  g: "linear-gradient(135deg,#00c48c,#009966)", ic: "Star" },
];

export const TABLE_DATA = [
  { q: "Can I build a hotel in R3 zone?",             cat: "Zoning",  loc: "Nashik, MH",      t: "2 min ago" },
  { q: "PMAY eligibility for ₹8L/yr income",          cat: "Scheme",  loc: "Pune, MH",         t: "5 min ago" },
  { q: "Max FAR for commercial plots in Mumbai",       cat: "Policy",  loc: "Mumbai, MH",       t: "11 min ago" },
  { q: "Noise restriction hours — residential",        cat: "Policy",  loc: "Aurangabad, MH",   t: "18 min ago" },
  { q: "Heritage zone renovation permit",              cat: "Zoning",  loc: "Nashik, MH",       t: "25 min ago" },
  { q: "Mudra loan for small bakery",                  cat: "Scheme",  loc: "Nagpur, MH",       t: "31 min ago" },
];
