import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AnimatedLogo from "../components/AnimatedLogo.jsx";

export default function SignupPage({ onNavigate }) {

  const { signup, loading, error, setError } = useAuth();

  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [conf, setConf]   = useState("");

  const [done, setDone] = useState(false);
  const [local, setLocal] = useState("");

  /* ---------------- SIGNUP HANDLER ---------------- */

  async function handleSubmit() {

    setLocal("");
    setError(null);

    if (!name || !email || !pass || !conf) {
      setLocal("All fields are required.");
      return;
    }

    if (pass.length < 6) {
      setLocal("Password must be at least 6 characters.");
      return;
    }

    if (pass !== conf) {
      setLocal("Passwords do not match.");
      return;
    }

    // Correct parameter order
    const ok = await signup(email, pass, name);

    if (ok) {
      setDone(true);
      setTimeout(() => onNavigate("login"), 2000);
    }
  }

  /* ---------------- SUCCESS SCREEN ---------------- */

  if (done) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-card--center">

          <div className="auth-success-icon">
            ✓
          </div>

          <div className="auth-title">
            Account created!
          </div>

          <div className="auth-sub">
            Redirecting you to sign in…
          </div>

        </div>
      </div>
    );
  }

  const err = local || error;

  /* ---------------- UI ---------------- */

  return (

    <div className="auth-shell">

      <div className="auth-card">

        <div className="auth-logo">
          <AnimatedLogo size={80} showName={true} />
        </div>

        <div className="auth-heading">

          <div className="auth-title">
            Create account
          </div>

          <div className="auth-sub">
            Join CivicSense · Nashik
          </div>

        </div>


        {/* ERROR MESSAGE */}

        {err && (
          <div
            className="auth-error"
            onClick={() => {
              setLocal("");
              setError(null);
            }}
          >
            {err} <span>×</span>
          </div>
        )}


        {/* FORM */}

        <div className="auth-fields">

          <div className="auth-field">
            <label>Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Raj Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="raj@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Minimum 6 characters"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Repeat password"
              value={conf}
              onChange={e => setConf(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

        </div>


        {/* BUTTON */}

        <button
          className="auth-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="auth-spinner" /> : "Create account"}
        </button>


        {/* FOOTER */}

        <div className="auth-footer">

          Already have an account?{" "}

          <span
            className="auth-link"
            onClick={() => onNavigate("login")}
          >
            Sign in
          </span>

        </div>

      </div>

    </div>

  );
}