import { useState, useEffect, useRef } from "react";
import { Ico } from "../icons/index.jsx";
import { HIST, INIT_MSGS } from "../data/index.js";
import { chatAI } from "../api/api";
import { uploadPDF } from "../api/api";
export default function ChatPage() {

  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [aid, setAid] = useState(1);

  const [showDropZone, setShowDropZone] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
 
  const [isUploading, setIsUploading] = useState(false);

  const hiddenFileRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

useEffect(() => {
  if (msgs.length === 0) {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setMsgs([
      {
        role: "ai",
        txt: "👋 Hello! I'm CivicSense AI. I'm always here to help you understand zoning rules, government schemes, and civic policies. Ask me anything!",
        t: time
      }
    ]);
  }
}, []);

  /* ---------------- PDF UPLOAD ---------------- */
const handlePDFUpload = async (file) => {

  if (!file) return;

  setUploadedFile(file);
  setIsUploading(true);

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  // show uploading message
  setMsgs(prev => [
    ...prev,
    {
      role: "ai",
      txt: `📤 Uploading "${file.name}"...`,
      t: time
    }
  ]);

  try {

    await uploadPDF(file);

    const doneTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setMsgs(prev => [
      ...prev,
      {
        role: "ai",
        txt: `✅ PDF "${file.name}" uploaded and analyzed successfully.`,
        t: doneTime
      }
    ]);

  } catch {

    setMsgs(prev => [
      ...prev,
      {
        role: "ai",
        txt: "⚠️ Failed to process PDF.",
        t: time
      }
    ]);

  } finally {
    setIsUploading(false);
  }
};
  /* ---------------- SEND MESSAGE ---------------- */

  const send = async (txt) => {

    const message = (txt || inp).trim();
    if (!message || typing) return;

    setInp("");

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    setMsgs(prev => [
      ...prev,
      {
        role: "user",
        txt: message,
        t: time
      }
    ]);

    setTyping(true);

    try {

      const res = await chatAI(message);

      const aiTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      setMsgs(prev => [
        ...prev,
        {
          role: "ai",
          txt: res.response,
          t: aiTime
        }
      ]);

    } catch (err) {

      setMsgs(prev => [
        ...prev,
        {
          role: "ai",
          txt: "⚠️ AI service temporarily unavailable. Please try again.",
          t: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      ]);

    } finally {
      setTyping(false);
    }
  };



  /* ---------------- QUICK CHIPS ---------------- */

  const CHIPS = [
    "PMAY eligibility",
    "Mudra loan details",
    "FAR limits in Nashik",
    "Building permits required"
  ];



  /* ---------------- MESSAGE RENDERER ---------------- */

  const renderMsg = (m, i) => {

    if (m.role === "user") {

      return (
        <div key={i} className="mrow u">

          <div className="mav u">
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>
              RK
            </span>
          </div>

          <div className="mbody">

            <div className="mmeta">
              <span className="mname">You</span>
              <span>{m.t}</span>
            </div>

            <div className="bub u">
              {m.txt}
            </div>

          </div>

        </div>
      );
    }


    return (
      <div key={i} className="mrow">

        <div className="mav ai">
          <Ico.Sparkle />
        </div>

        <div className="mbody">

          <div className="mmeta">
            <span className="mname">CivicSense AI</span>
            <span>{m.t}</span>
          </div>

          <div className="bub ai">
            {m.txt}
          </div>

        </div>

      </div>
    );
  };



  /* ---------------- UI ---------------- */

  return (

    <div className="chat-wrap">

      {/* SIDEBAR */}

      <div className="chat-rail">

        <div className="rail-hd">

          <button
            className="rail-new"
            onClick={() => {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  setMsgs([
    {
      role: "ai",
      txt: "👋 Hello! I'm CivicSense AI. I'm always here to help you with zoning, permits, and government schemes.",
      t: time
    }
  ]);
}}
          >
            <Ico.Plus /> New conversation
          </button>


          {/* PDF ANALYZER */}

          <div className="rail-pdf-section">  

            <div className="rail-lbl">PDF Analyzer</div>

            <button
              className="rail-upload-btn"
              onClick={() => hiddenFileRef.current?.click()}
            >
              📤 Upload Scheme PDF
            </button>

            <input
  ref={hiddenFileRef}
  type="file"
  accept="application/pdf"
  style={{ display: "none" }}
  onChange={(e) => handlePDFUpload(e.target.files?.[0])}
/>
          </div>


          <div className="rail-lbl" style={{ marginTop: 16 }}>
            Recent
          </div>

        </div>



        <div className="rail-list">

          {HIST.map(h => (

            <div
              key={h.id}
              className={`ri ${aid === h.id ? "on" : ""}`}
              onClick={() => setAid(h.id)}
            >

              <div className="ri-t">
                {h.t}
              </div>

              <div className="ri-d">
                {h.d}
              </div>

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
      <div className="upload-spinner"></div>
      <span>Analyzing PDF...</span>
    </div>
  </div>
)}
          <div className="msgs">

            {msgs.length === 0 ? (

              <div className="welcome">

                <div className="worb">
                  <Ico.Sparkle />
                </div>

                <div className="wtitle">
                  CivicSense AI
                </div>

                <div className="wsub">
                  Ask about zoning, permits, and government schemes.
                </div>
                {uploadedFile && (
  <div style={{ marginTop: 10, fontSize: 13, color: "#4CAF50" }}>
    📄 Active document: {uploadedFile.name}
  </div>
)}

              </div>

            ) : (

              msgs.map(renderMsg)

            )}


            {typing && (

              <div className="typing">

                <div className="mav ai">
                  <Ico.Sparkle />
                </div>

                <div
                  className="bub ai"
                  style={{ padding: "14px 18px" }}
                >

                  <span className="tdot" />
                  <span className="tdot" />
                  <span className="tdot" />

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
                onChange={(e) => setInp(e.target.value)}
                placeholder="Ask about zoning, permits, schemes..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />


              <div className="inp-foot">

                <div className="ichips">

                  {CHIPS.map((c, i) => (

                    <div
                      key={i}
                      className="ichip"
                      onClick={() => send(c)}
                    >
                      {c}
                    </div>

                  ))}

                </div>


                <button
                  className="sbtn"
                  onClick={() => send()}
                  disabled={!inp.trim() || typing}
                >
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