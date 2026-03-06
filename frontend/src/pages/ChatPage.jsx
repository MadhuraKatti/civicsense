import { useState, useEffect, useRef } from "react";
import { Ico } from "../icons/index.jsx";
import { HIST, INIT_MSGS } from "../data/index.js";
import { chatAI, uploadPDF } from "../api/api";

/* Render plain text with real newlines */
function PlainMsg({ txt }) {
  return (
    <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.65 }}>
      {txt}
    </div>
  );
}

/* Render structured AI message (used in INIT_MSGS demo) */
function StructuredMsg({ data }) {
  const Tag = ({ label, items, color }) => items?.length > 0 && (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: 6 }}>{label}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: 13, lineHeight: 1.5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, marginTop: 7, flexShrink: 0 }} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div>
      {data.summary && <div style={{ lineHeight: 1.65, marginBottom: 6 }}>{data.summary}</div>}
      <Tag label="Rules" items={data.rules} color="var(--blue2,#1a7ef0)" />
      <Tag label="Permits Required" items={data.permits} color="var(--green2,#00c48c)" />
      {data.refs?.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(29,140,248,0.15)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: 6 }}>Sources</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.refs.map((r, i) => (
              <span key={i} style={{ fontSize: 11, background: "rgba(29,140,248,0.1)", border: "1px solid rgba(29,140,248,0.2)", borderRadius: 5, padding: "2px 8px", color: "var(--blue2,#1a7ef0)" }}>{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const [msgs, setMsgs]               = useState(INIT_MSGS);
  const [inp, setInp]                 = useState("");
  const [typing, setTyping]           = useState(false);
  const [aid, setAid]                 = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const hiddenFileRef = useRef(null);
  const endRef        = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  /* ── PDF UPLOAD ─────────────────────────────── */
  const handlePDFUpload = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setIsUploading(true);
    const t = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs(p => [...p, { role: "ai", txt: `📤 Uploading "${file.name}"…`, t: t() }]);
    try {
      const res = await uploadPDF(file);
      setMsgs(p => [...p, {
        role: "ai",
        txt: `✅ "${file.name}" (${res.size_kb} KB) uploaded.\n\n${res.message}`,
        t: t(),
      }]);
    } catch {
      setMsgs(p => [...p, { role: "ai", txt: "⚠️ PDF upload failed. Make sure the backend server is running on port 8000.", t: t() }]);
    } finally {
      setIsUploading(false);
      // Reset input so same file can be re-uploaded
      if (hiddenFileRef.current) hiddenFileRef.current.value = "";
    }
  };

  /* ── SEND MESSAGE ───────────────────────────── */
  const send = async (txt) => {
    const message = (txt || inp).trim();
    if (!message || typing) return;
    setInp("");
    const t = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs(p => [...p, { role: "user", txt: message, t: t() }]);
    setTyping(true);
    try {
      const res = await chatAI(message);
      setMsgs(p => [...p, { role: "ai", txt: res.response || "I received your message but had no response.", t: t() }]);
    } catch {
      setMsgs(p => [...p, { role: "ai", txt: "⚠️ Backend not reachable.\n\nMake sure the FastAPI server is running:\n  cd backend && uvicorn main:app --reload --port 8000", t: t() }]);
    } finally {
      setTyping(false);
    }
  };

  const CHIPS = ["FAR limits Nashik", "Building permits", "PMAY eligibility", "Heritage zone rules"];

  /* ── RENDER ONE MESSAGE ─────────────────────── */
  const renderMsg = (m, i) => {
    const isUser = m.role === "user";
    return (
      <div key={i} className={`mrow${isUser ? " u" : ""}`}>
        <div className={`mav${isUser ? " u" : " ai"}`}>
          {isUser
            ? <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>RK</span>
            : <Ico.Sparkle />}
        </div>
        <div className="mbody">
          <div className="mmeta">
            <span className="mname">{isUser ? "You" : "CivicSense AI"}</span>
            <span style={{ fontSize: 11, opacity: 0.4 }}>{m.t}</span>
          </div>
          <div className={`bub${isUser ? " u" : " ai"}`}>
            {m.structured ? <StructuredMsg data={m.structured} /> : <PlainMsg txt={m.txt} />}
          </div>
        </div>
      </div>
    );
  };

  /* ── UI ─────────────────────────────────────── */
  return (
    <div className="chat-wrap">
      {/* SIDEBAR */}
      <div className="chat-rail">
        <div className="rail-hd">
          <button className="rail-new" onClick={() => { setMsgs([]); setUploadedFile(null); }}>
            <Ico.Plus /> New conversation
          </button>

          <div className="rail-pdf-section">
            <div className="rail-lbl">PDF Analyzer</div>
            <button
              className="rail-upload-btn"
              onClick={() => hiddenFileRef.current?.click()}
              disabled={isUploading}
              style={{ opacity: isUploading ? 0.6 : 1 }}
            >
              {isUploading ? "⏳ Uploading…" : "📎 Upload PDF"}
            </button>
            {uploadedFile && !isUploading && (
              <div style={{ fontSize: 11, color: "var(--green2,#00c48c)", marginTop: 7, display: "flex", alignItems: "center", gap: 5, padding: "0 2px" }}>
                <span>📄</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
                  {uploadedFile.name}
                </span>
              </div>
            )}
            <input
              ref={hiddenFileRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={e => handlePDFUpload(e.target.files?.[0])}
            />
          </div>

          <div className="rail-lbl" style={{ marginTop: 16 }}>Recent</div>
        </div>

        <div className="rail-list">
          {HIST.map(h => (
            <div key={h.id} className={`ri${aid === h.id ? " on" : ""}`} onClick={() => setAid(h.id)}>
              <div className="ri-t">{h.t}</div>
              <div className="ri-d">{h.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="chat-center">
        <div className="chat-col">
          {isUploading && (
            <div className="upload-bar">
              <div className="upload-bar-inner">
                <div className="upload-spinner" />
                <span>Analyzing PDF…</span>
              </div>
            </div>
          )}

          <div className="msgs">
            {msgs.length === 0 ? (
              <div className="welcome">
                <div className="worb"><Ico.Sparkle /></div>
                <div className="wtitle">CivicSense AI</div>
                <div className="wsub">Ask about Nashik zoning, permits, and government schemes in plain language.</div>
                {uploadedFile && (
                  <div style={{ marginTop: 10, fontSize: 13, color: "var(--green2,#00c48c)", display: "flex", alignItems: "center", gap: 6 }}>
                    📄 Active: {uploadedFile.name}
                  </div>
                )}
              </div>
            ) : msgs.map(renderMsg)}

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

          {/* INPUT */}
          <div className="inp-area">
            <div className="inp-shell">
              <textarea
                className="inp-ta"
                rows={2}
                value={inp}
                onChange={e => setInp(e.target.value)}
                placeholder="Ask about zoning, permits, schemes… (Enter to send, Shift+Enter for new line)"
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              />
              <div className="inp-foot">
                <div className="ichips">
                  {CHIPS.map((c, i) => (
                    <div key={i} className="ichip" onClick={() => send(c)}>{c}</div>
                  ))}
                </div>
                <button className="sbtn" onClick={() => send()} disabled={!inp.trim() || typing}>
                  <Ico.Send />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
