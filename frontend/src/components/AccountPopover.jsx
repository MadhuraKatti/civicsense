import { useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Ico } from "../icons/index.jsx";

export default function AccountPopover({ onClose, onOpenAuth }) {
  const { user, logout } = useAuth();
  const ref = useRef();

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="account-popover" ref={ref}>
      {user ? (
        <>
          {/* Header */}
          <div className="ap-header">
            <div className="ap-avatar">{initials}</div>
            <div className="ap-info">
              <div className="ap-name">{user.name}</div>
              <div className="ap-email">{user.email}</div>
            </div>
          </div>

          <div className="ap-divider" />

          {/* Account details */}
          <div className="ap-section-label">Account</div>
          <div className="ap-rows">
            <div className="ap-row">
              <span className="ap-row-icon"><Ico.User /></span>
              <span>Profile</span>
              <span className="ap-row-badge">Soon</span>
            </div>
            <div className="ap-row">
              <span className="ap-row-icon"><Ico.Bell /></span>
              <span>Notifications</span>
            </div>
            <div className="ap-row">
              <span className="ap-row-icon"><Ico.Shield /></span>
              <span>Privacy &amp; Data</span>
              <span className="ap-row-badge">Soon</span>
            </div>
          </div>

          <div className="ap-divider" />

          {/* Sign out */}
          <button
            className="ap-signout"
            onClick={() => { logout(); onClose(); }}
          >
            <Ico.X />
            Sign out
          </button>
        </>
      ) : (
        <>
          {/* Guest state */}
          <div className="ap-guest-header">
            <div className="ap-guest-icon">
              <Ico.User />
            </div>
            <div className="ap-info">
              <div className="ap-name">Guest</div>
              <div className="ap-email">Not signed in</div>
            </div>
          </div>

          <div className="ap-divider" />

          <div className="ap-guest-body">
            <div className="ap-guest-msg">
              Sign in to access AI Assistant, Zoning Map, and Dashboard features.
            </div>
            <button
              className="ap-signin-btn"
              onClick={() => { onOpenAuth(); onClose(); }}
            >
              Sign in or create account
            </button>
          </div>
        </>
      )}

      <div className="ap-footer">
        <span>CivicSense · Nashik</span>
        <span className="ap-version">v1.0</span>
      </div>
    </div>
  );
}
