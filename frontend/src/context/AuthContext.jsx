import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── Load session on mount ────────────────────────────────────────── */
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.warn("[AuthContext] Could not load session:", err.message);
      }
    };

    loadSession();

    let unsubscribe = () => {};
    try {
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        }
      );
      unsubscribe = () => listener.subscription.unsubscribe();
    } catch (err) {
      console.warn("[AuthContext] Could not subscribe to auth changes:", err.message);
    }

    return unsubscribe;
  }, []);

  /* ── Login ───────────────────────────────────────────────────────── */
  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        return false;
      }
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  /* ── Signup ──────────────────────────────────────────────────────── */
  async function signup(fullName, email, password) {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (authError) {
        setError(authError.message);
        return false;
      }
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  /* ── Logout ──────────────────────────────────────────────────────── */
  async function logout() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("[AuthContext] signOut error:", err.message);
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
