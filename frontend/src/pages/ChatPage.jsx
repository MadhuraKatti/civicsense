import { useState, useEffect, useRef, useCallback } from "react";
import { Ico } from "../icons/index.jsx";
import { HIST, INIT_MSGS } from "../data/index.js";

// ─── Anthropic API ────────────────────────────────────────────────────────────
async function callCivicAI(conversationMsgs, pdfContext) {
  const systemPrompt = `You are CivicSense AI — a precise civic intelligence assistant for Nashik, Maharashtra. You specialize in:
- Indian government schemes (PMAY, Mudra, MHADA, Startup India, etc.)
- Maharashtra zoning & building regulations (MH DCR 2017, NMC Bye-Laws)
- Permits and approvals (NMC, Fire NOC, MIDC, Environmental Clearance)
- Urban development and civic policy

${pdfContext ? `UPLOADED SCHEME DOCUMENT CONTEXT:\n${pdfContext}\n\nAnswer all questions based on this uploaded document.` : ""}

RESPONSE FORMAT — Always return a JSON object with this shape:
{
  "summary": "One concise sentence overview",
  "isPdfAnalysis": true or false,
  "sections": [
    { "title": "Eligibility", "icon": "✅", "points": ["point1", "point2"] },
    { "title": "Benefits", "icon": "🎁", "points": ["point1"] },
    { "title": "Required Documents", "icon": "📄", "points": ["point1"] },
    { "title": "Application Process", "icon": "📋", "points": ["step1"] }
  ],
  "refs": ["MH DCR 2017", "etc"],
  "plainText": "Use this for simple conversational answers instead of sections"
}

Rules:
- For scheme/policy queries: populate sections array, leave plainText empty
- For simple factual questions: use plainText, leave sections as empty array
- Return ONLY valid JSON. No markdown code fences. No extra text.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: conversationMsgs,
    }),
  });

  if (!response.ok) throw new Error("API error " + response.status);
  const data = await response.json();
  const raw = data.content?.[0]?.text || "{}";
  try {
    return JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
  } catch {
    return { summary: "", sections: [], refs: [], plainText: raw };
  }
}

// ─── PDF context simulator ────────────────────────────────────────────────────
function getPdfContext(fileName) {
  const n = (fileName || "").toLowerCase();
  if (n.includes("pmay") || n.includes("awas") || n.includes("housing"))
    return `PRADHAN MANTRI AWAS YOJANA — Urban Housing for All (2024)
Eligibility: Annual income EWS ≤₹3L, LIG ₹3–6L, MIG-I ₹6–12L, MIG-II ₹12–18L. Must be first-time homebuyer. No pucca house in any part of India. Preference: women ownership, SC/ST, minorities, differently-abled.
Benefits: Interest subsidy 6.5% (EWS/LIG) on loans up to ₹6L; 4% (MIG-I) on ₹9L; 3% (MIG-II) on ₹12L. Net subsidy up to ₹2.67 lakh. Capital subsidy credited upfront.
Required Documents: Aadhaar card, PAN card, Income certificate (gazetted), Salary slips / IT returns, Caste certificate (SC/ST), Bank statements (6 months), Property agreement.
Application Process: Apply via empanelled Primary Lending Institutions. Submit at nearest CSC or nodal ULB. ULB verification within 30 days. Subsidy credited within 75 days.
Deadline: Extended through December 2024.
Ministry: Ministry of Housing & Urban Affairs. Nodal: NHB / HUDCO.`;

  if (n.includes("mudra"))
    return `PM MUDRA YOJANA — Micro Units Development & Refinance Agency
Eligibility: Non-farm small/micro enterprises. Proprietorships, partnerships, private limited companies. No minimum turnover. No collateral for Shishu.
Benefits: Shishu: up to ₹50,000; Kishore: ₹50,001–₹5 lakh; Tarun: ₹5–₹10 lakh. Processing fee waived for Shishu. MUDRA RuPay Card for working capital.
Required Documents: Identity proof, address proof, business registration, bank statements (6 months), photographs.
Application Process: Apply at any scheduled bank, NBFC, or MFI. Approval in 7–15 working days.`;

  if (n.includes("startup") || n.includes("dpiit"))
    return `STARTUP INDIA SEED FUND SCHEME
Eligibility: DPIIT-recognised startup, incorporated ≤2 years. Innovative product/service. Not received >₹10L from other government schemes.
Benefits: Up to ₹20 lakh grant for proof of concept. Up to ₹50 lakh investment for market entry. Equity-free for grants.
Required Documents: DPIIT recognition certificate, COI, business plan, financial projections, founder Aadhaar & PAN.
Application Process: Apply via Startup India portal. Evaluation by DPIIT-empanelled incubator. Selection within 45 days.`;

  return `GOVERNMENT SCHEME DOCUMENT — ${fileName}
This scheme document outlines eligibility, benefits, and application procedures.
Eligibility: Indian citizens meeting income and residency criteria as specified.
Benefits: Financial assistance, subsidies, and support services as defined by the nodal ministry.
Required Documents: Government identity proof, income certificate, address proof, photographs.
Application: Through designated nodal agencies, CSC centres, or online government portals.`;
}

// ─── Text renderer ────────────────────────────────────────────────────────────
function RenderText({ text }) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ marginBottom: line ? 5 : 8, lineHeight: 1.7 }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
      </p>
    );
  });
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const [msgs, setMsgs]               = useState(INIT_MSGS);
  const [inp, setInp]                 = useState("");
  const [typing, setTyping]           = useState(false);
  const [aid, setAid]                 = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [isDragging, setIsDragging]   = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);
  const [apiHistory, setApiHistory]   = useState([]);

  const endRef      = useRef(null);
  const fileInputRef = useRef(null);
  const hiddenFileRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  // Progress bar animation
  useEffect(() => {
    if (!isAnalyzing) { setAnalyzeProgress(0); return; }
    setAnalyzeProgress(5);
    const milestones = [20, 42, 61, 78, 90, 96];
    let idx = 0;
    const t = setInterval(() => {
      if (idx < milestones.length) setAnalyzeProgress(milestones[idx++]);
      else clearInterval(t);
    }, 300);
    return () => clearInterval(t);
  }, [isAnalyzing]);

  // ── File upload handler ──────────────────────────────────────────────────
  const handleFileUpload = useCallback((file) => {
    if (!file || file.type !== "application/pdf") return;
    setUploadedFile(file);
    setIsAnalyzing(true);
    setShowDropZone(false);

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzeProgress(100);
      setMsgs(prev => [...prev, {
        role: "ai", type: "pdf-ready", fileName: file.name, t: time,
      }]);
      setTimeout(() => setAnalyzeProgress(0), 700);
    }, 2400);
  }, []);

  // ── Drag and drop ────────────────────────────────────────────────────────
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files?.[0]);
  }, [handleFileUpload]);

  const onDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);

  // ── Send message ─────────────────────────────────────────────────────────
  const send = async (txt) => {
    const message = (txt || inp).trim();
    if (!message || typing) return;
    setInp("");

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs(prev => [...prev, { role: "user", txt: message, t: time }]);
    setTyping(true);

    const newHist = [...apiHistory, { role: "user", content: message }];
    try {
      const pdfCtx = uploadedFile ? getPdfContext(uploadedFile.name) : null;
      const result = await callCivicAI(newHist, pdfCtx);
      const aiT = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setApiHistory([...newHist, { role: "assistant", content: result.plainText || result.summary || "" }]);
      setMsgs(prev => [...prev, { role: "ai", type: "structured", data: result, t: aiT }]);
    } catch {
      setMsgs(prev => [...prev, {
        role: "ai", type: "error",
        txt: "⚠️ AI service temporarily unavailable. Please try again.",
        t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setTyping(false);
    }
  };

  const CHIPS = ["FAR limits in Nashik", "Heritage zone rules", "PMAY eligibility", "Permit checklist"];
  const SUGG = [
    { e: "🏗️", t: "Zoning & Building Rules", s: "FAR, heights, setbacks", q: "What are the FAR limits for commercial zones in Nashik?" },
    { e: "📋", t: "Permits & Approvals", s: "NMC, fire NOC, clearances", q: "What permits do I need to build a 4-floor residential building?" },
    { e: "🏘️", t: "Government Schemes", s: "PMAY, Mudra, MHADA", q: "What housing schemes am I eligible for in Nashik?" },
    { e: "📄", t: "Analyse a Scheme PDF", s: "Upload & ask any document", q: null, isPdf: true },
  ];

  // ── Message renderer ─────────────────────────────────────────────────────
  const renderMsg = (m, i) => {
    if (m.role === "user") return (
      <div key={i} className="mrow u">
        <div className="mav u">
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>RK</span>
        </div>
        <div className="mbody">
          <div className="mmeta"><span className="mname">You</span><span>{m.t}</span></div>
          <div className="bub u">{m.txt}</div>
        </div>
      </div>
    );

    if (m.type === "pdf-ready") return (
      <div key={i} className="mrow">
        <div className="mav ai"><Ico.Sparkle /></div>
        <div className="mbody" style={{ maxWidth: "82%" }}>
          <div className="mmeta"><span className="mname">CivicSense AI</span><span>{m.t}</span></div>
          <div className="bub ai pdf-ready-card">
            <div className="pdf-ready-header">
              <div className="pdf-ready-icon-wrap">📄</div>
              <div>
                <div className="pdf-ready-title">Scheme document uploaded successfully</div>
                <div className="pdf-ready-file">{m.fileName}</div>
              </div>
            </div>
            <div className="pdf-ready-body">You can now ask questions about this scheme.</div>
            <div className="pdf-sugg-chips">
              {["Who is eligible?", "What benefits are offered?", "Documents required?", "How to apply?"].map((q, j) => (
                <button key={j} className="pdf-sugg-chip" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    if (m.type === "structured" && m.data) {
      const d = m.data;
      const hasSections = d.sections?.some(s => s.points?.length > 0);
      return (
        <div key={i} className="mrow">
          <div className="mav ai"><Ico.Sparkle /></div>
          <div className="mbody" style={{ maxWidth: "84%" }}>
            <div className="mmeta"><span className="mname">CivicSense AI</span><span>{m.t}</span></div>
            <div className={`bub ai${hasSections ? " insight-card" : ""}`}>
              {d.summary && <div className="ai-summary">{d.summary}</div>}
              {hasSections && (
                <div className="insight-sections">
                  {d.sections.filter(s => s.points?.length > 0).map((sec, si) => (
                    <div key={si} className="insight-section">
                      <div className="sttl"><span>{sec.icon}</span> {sec.title}</div>
                      {sec.points.map((pt, pi) => (
                        <div key={pi} className="arule"><div className="rdot" /><span>{pt}</span></div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {!hasSections && d.plainText && (
                <div className="ai-plain"><RenderText text={d.plainText} /></div>
              )}
              {d.refs?.length > 0 && (
                <>
                  <div className="sttl" style={{ marginTop: 14 }}><span>📚</span> References</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                    {d.refs.map((r, ri) => <span key={ri} className="refpill">📄 {r}</span>)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Fallback (old structured or error)
    return (
      <div key={i} className="mrow">
        <div className="mav ai"><Ico.Sparkle /></div>
        <div className="mbody">
          <div className="mmeta"><span className="mname">CivicSense AI</span><span>{m.t}</span></div>
          <div className="bub ai">
            {m.structured ? (
              <>
                <div style={{ lineHeight: 1.65 }}>{m.structured.summary}</div>
                {m.structured.rules?.length > 0 && <>
                  <div className="sttl">Key Regulations</div>
                  {m.structured.rules.map((r, j) => <div key={j} className="arule"><div className="rdot" />{r}</div>)}
                </>}
                {m.structured.permits?.length > 0 && <>
                  <div className="sttl">Required Permits</div>
                  {m.structured.permits.map((p, j) => <div key={j} className="arule"><div className="rdot" style={{ background: "var(--blue2)" }} />{p}</div>)}
                </>}
                {m.structured.refs?.length > 0 && <>
                  <div className="sttl">References</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                    {m.structured.refs.map((r, j) => <span key={j} className="refpill">📄 {r}</span>)}
                  </div>
                </>}
              </>
            ) : (
              <div>{m.txt}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="chat-wrap" onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>

      {/* Global drag overlay */}
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-overlay-inner">
            <div className="drag-icon-big">📄</div>
            <div className="drag-title">Drop your PDF here</div>
            <div className="drag-sub">Release to analyze the scheme document</div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <div className="chat-rail">
        <div className="rail-hd">
          <button className="rail-new" onClick={() => { setMsgs([]); setUploadedFile(null); setApiHistory([]); setShowDropZone(false); }}>
            <Ico.Plus /> New conversation
          </button>

          <div className="rail-pdf-section">
            <div className="rail-lbl">PDF Analyzer</div>
            <button className="rail-upload-btn" onClick={() => { setShowDropZone(v => !v); }}>
              <span>📤</span> Upload Scheme PDF
            </button>
          </div>

          <div className="rail-lbl" style={{ marginTop: 16 }}>Recent</div>
        </div>

        <div className="rail-list">
          {HIST.map(h => (
            <div key={h.id} className={`ri ${aid === h.id ? "on" : ""}`} onClick={() => setAid(h.id)}>
              <div className="ri-t">{h.t}</div>
              <div className="ri-d">{h.d}</div>
            </div>
          ))}
        </div>

        <div className="rail-ctx">
          <div className="rctx-l">Active Context</div>
          <div className="rctx-v">
            📍 Nashik, MH<br />MH DCR 2017 · NMC
            {uploadedFile && <><br /><span style={{ color: "var(--green2)" }}>📄 {uploadedFile.name.slice(0, 18)}{uploadedFile.name.length > 18 ? "…" : ""}</span></>}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="chat-center">
        <div className="chat-col">

          {/* Drop zone panel */}
          {showDropZone && (
            <div className="drop-zone-panel">
              <div
                className={`drop-zone${isDragging ? " drag-active" : ""}`}
                onClick={() => hiddenFileRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileUpload(e.dataTransfer.files?.[0]); }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                onDragLeave={(e) => { e.stopPropagation(); setIsDragging(false); }}
              >
                <div className="dz-icon">📄</div>
                <div className="dz-title">Upload Scheme PDF</div>
                <div className="dz-sub">Drag & drop or <span className="dz-link">click to browse</span></div>
                <div className="dz-hint">Supports government scheme PDFs · Max 10MB</div>
              </div>
              <input ref={hiddenFileRef} type="file" accept="application/pdf" style={{ display: "none" }}
                onChange={(e) => { handleFileUpload(e.target.files?.[0]); }} />
            </div>
          )}

          {/* Analyzing progress bar */}
          {isAnalyzing && (
            <div className="analyze-bar-wrap">
              <div className="analyze-bar-header">
                <div className="analyze-spinner" />
                <span className="analyze-label">Analyzing scheme document…</span>
                <span className="analyze-pct">{analyzeProgress}%</span>
              </div>
              <div className="analyze-track">
                <div className="analyze-fill" style={{ width: `${analyzeProgress}%` }} />
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="msgs">
            {msgs.length === 0 ? (
              <div className="welcome">
                <div className="worb"><Ico.Sparkle /></div>
                <div className="wtitle">CivicSense AI</div>
                <div className="wsub">
                  Ask about zoning, permits, and schemes — or upload a government scheme PDF for instant analysis.
                </div>
                <div className="sgg">
                  {SUGG.map((s, i) => (
                    <div key={i} className="sg" onClick={() => s.isPdf ? setShowDropZone(true) : send(s.q)}>
                      <div className="sg-e">{s.e}</div>
                      <div className="sg-t">{s.t}</div>
                      <div className="sg-s">{s.s}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              msgs.map(renderMsg)
            )}

            {typing && (
              <div className="typing">
                <div className="mav ai"><Ico.Sparkle /></div>
                <div className="bub ai" style={{ padding: "14px 18px" }}>
                  <span className="tdot" /><span className="tdot" /><span className="tdot" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* ── Input area ── */}
          <div className="inp-area">

            {/* File chip */}
            {uploadedFile && !isAnalyzing && (
              <div className="file-chip-row">
                <div className="file-chip">
                  <span>📄</span>
                  <span className="file-chip-name">{uploadedFile.name}</span>
                  <button className="file-chip-remove" onClick={() => { setUploadedFile(null); setApiHistory([]); }} title="Remove">
                    <Ico.X />
                  </button>
                </div>
                <span className="file-chip-status">✓ AI has context from this document</span>
              </div>
            )}

            <div className="inp-shell">
              <textarea
                className="inp-ta"
                rows={2}
                value={inp}
                onChange={(e) => setInp(e.target.value)}
                placeholder={uploadedFile ? `Ask questions about ${uploadedFile.name}…` : "Ask about zoning, permits, schemes, or upload a PDF…"}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />

              <div className="inp-foot">
                <div className="ichips">
                  {CHIPS.map((c, i) => <div key={i} className="ichip" onClick={() => send(c)}>{c}</div>)}
                </div>

                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <button className="pdf-btn" title="Upload scheme PDF" onClick={() => { setShowDropZone(v => !v); }}>
                    <Ico.File />
                  </button>
                  <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e.target.files?.[0])} />
                  <button className="sbtn" onClick={() => send()} disabled={!inp.trim() || typing}>
                    <Ico.Send />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
