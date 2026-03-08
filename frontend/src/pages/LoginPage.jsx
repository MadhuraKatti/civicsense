import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AnimatedLogo from "../components/AnimatedLogo.jsx";
import { Ico } from "../icons/index.jsx";

export default function LoginPage({ onNavigate }) {
  const { login, loading, error, setError } = useAuth();
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [show, setShow]     = useState(false);

 async function handleSubmit() {
  if (!email || !pass) return;

  const ok = await login(email, pass);

  if (ok) {
    onNavigate("home");
  } else {
    setError("Invalid email or password");
  }
}
  function handleKey(e) { if (e.key === "Enter") handleSubmit(); }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <AnimatedLogo size={80} showName={true} />
        </div>
        <div className="auth-heading">
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to CivicSense · Nashik</div>
        </div>

        {error && (
          <div className="auth-error" onClick={() => setError(null)}>
            {error} <span>×</span>
          </div>
        )}

        <div className="auth-fields">
          <div className="auth-field">
            <label>Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={handleKey}
                autoComplete="current-password"
              />
              <button className="auth-eye" onClick={() => setShow(s => !s)} tabIndex={-1}>
                {show ? <Ico.X /> : <Ico.Sun />}
              </button>
            </div>
          </div>
        </div>

        <button className="auth-btn" onClick={handleSubmit} disabled={loading || !email || !pass}>
          {loading ? <span className="auth-spinner" /> : "Sign in"}
        </button>

       

        <div className="auth-divider"><span>or</span></div>

        <button className="auth-btn-ghost" onClick={() => onNavigate("home")}>
          Browse as Guest
        </button>

        <div className="auth-footer">
          Don't have an account?&nbsp;
          <span className="auth-link" onClick={() => onNavigate("signup")}>Sign up</span>
        </div>
      </div>
    </div>
  );
}
