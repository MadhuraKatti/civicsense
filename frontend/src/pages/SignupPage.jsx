import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AnimatedLogo from "../components/AnimatedLogo.jsx";

export default function SignupPage({ onNavigate }) {
  const { signup, loading, error, setError } = useAuth();
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [conf, setConf]     = useState("");
  const [done, setDone]     = useState(false);
  const [local, setLocal]   = useState("");

  async function handleSubmit() {
    setLocal("");
    if (!name || !email || !pass || !conf) { setLocal("All fields are required."); return; }
    if (pass.length < 6) { setLocal("Password must be at least 6 characters."); return; }
    if (pass !== conf) { setLocal("Passwords do not match."); return; }
    const ok = await signup(name, email, pass);
    if (ok) {
      setDone(true);
      setTimeout(() => onNavigate("login"), 2000);
    }
  }

  if (done) return (
    <div className="auth-shell">
      <div className="auth-card auth-card--center">
        <div className="auth-success-icon">✓</div>
        <div className="auth-title">Account created!</div>
        <div className="auth-sub">Redirecting you to sign in…</div>
      </div>
    </div>
  );

  const err = local || error;

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo"><AnimatedLogo size={80} showName={true} /></div>
        <div className="auth-heading">
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Join CivicSense · Nashik</div>
        </div>

        {err && (
          <div className="auth-error" onClick={() => { setLocal(""); setError(null); }}>
            {err} <span>×</span>
          </div>
        )}

        <div className="auth-fields">
          {[
            { label: "Full Name",        val: name,  set: setName,  type: "text",     ph: "Raj Kumar" },
            { label: "Email",            val: email, set: setEmail, type: "email",    ph: "raj@example.com" },
            { label: "Password",         val: pass,  set: setPass,  type: "password", ph: "Min 6 characters" },
            { label: "Confirm Password", val: conf,  set: setConf,  type: "password", ph: "Repeat password" },
          ].map(({ label, val, set, type, ph }) => (
            <div className="auth-field" key={label}>
              <label>{label}</label>
              <input
                className="auth-input"
                type={type}
                placeholder={ph}
                value={val}
                onChange={e => set(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>
          ))}
        </div>

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="auth-spinner" /> : "Create account"}
        </button>

        <div className="auth-footer">
          Already have an account?&nbsp;
          <span className="auth-link" onClick={() => onNavigate("login")}>Sign in</span>
        </div>
      </div>
    </div>
  );
}
