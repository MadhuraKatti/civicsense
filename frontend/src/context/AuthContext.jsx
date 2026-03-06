import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Local user store — works even when backend is offline
const LOCAL_USERS_KEY = "civicsense-local-users";
function getLocalUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]"); } catch { return []; }
}
function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

// Seed demo user if not present
(function seedDemo() {
  const users = getLocalUsers();
  if (!users.find(u => u.email === "admin@civicsense.in")) {
    users.push({ name: "Admin", email: "admin@civicsense.in", password: "admin123" });
    saveLocalUsers(users);
  }
})();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("civicsense-user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function login(email, password) {
    setLoading(true); setError(null);
    try {
      // Try backend first
      const res = await Promise.race([
        fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000)),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      setUser(data);
      localStorage.setItem("civicsense-user", JSON.stringify(data));
      return true;
    } catch (backendErr) {
      // Fallback: check local store
      const users = getLocalUsers();
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        const userData = { name: found.name, email: found.email, token: "local-" + Date.now() };
        setUser(userData);
        localStorage.setItem("civicsense-user", JSON.stringify(userData));
        return true;
      }
      setError("Invalid email or password");
      return false;
    } finally { setLoading(false); }
  }

  async function signup(name, email, password) {
    setLoading(true); setError(null);
    try {
      const res = await Promise.race([
        fetch(`${API}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000)),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Signup failed");
      return true;
    } catch {
      // Fallback: save to local store
      const users = getLocalUsers();
      if (users.find(u => u.email === email)) {
        setError("Email already registered");
        return false;
      }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return false; }
      users.push({ name, email, password });
      saveLocalUsers(users);
      return true;
    } finally { setLoading(false); }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("civicsense-user");
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
