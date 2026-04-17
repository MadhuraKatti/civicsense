/**
 * CivicSense API client
 * All requests route through this file so the base URL is configured in ONE place.
 *
 * Required env variable (set in Vercel → Settings → Environment Variables):
 *   VITE_API_BASE_URL = https://civicsense-7y58.onrender.com
 */

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://civicsense-7y58.onrender.com";

/** Inject Supabase JWT if present (for future protected endpoints). */
async function authHeaders() {
  try {
    const { supabase } = await import("../lib/supabase");
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    /* supabase not configured — skip token */
  }
  return {};
}

/* ─────────────────────────── AI CHAT ─────────────────────────── */

export async function chatAI(message) {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  return res.json();
}

/* ─────────────────────────── DASHBOARD ───────────────────────── */

export async function getDashboard() {
  const res = await fetch(`${API_BASE}/analytics/dashboard`);
  if (!res.ok) throw new Error("Dashboard fetch failed");
  return res.json();
}

/* ─────────────────────────── SCHEMES ─────────────────────────── */

export async function checkSchemes(profile) {
  const res = await fetch(`${API_BASE}/schemes/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error(`Scheme eligibility check failed (${res.status})`);
  return res.json();
}

/* ---------------- ZONES ---------------- */

export async function getZones() {
  const res = await fetch(`${API_BASE}/zones`);
  if (!res.ok) throw new Error("Zones fetch failed");
  return res.json();
}

/* ─────────────────────────── PDF UPLOAD ──────────────────────── */

export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/ai/upload-pdf`, {
    method: "POST",
    headers: await authHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error(`PDF upload failed (${res.status})`);
  return res.json();
}

/* ─────────────────────────── ALERTS ──────────────────────────── */

export async function getAlerts() {
  const res = await fetch(`${BASE_URL}/alerts`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error(`Alerts fetch failed (${res.status})`);
  return res.json();
}

/* ─────────────────────────── SEARCH ──────────────────────────── */

export async function searchQuery(q) {
  const res = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(q)}`,
    { headers: await authHeaders() }
  );
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  return res.json();
}
