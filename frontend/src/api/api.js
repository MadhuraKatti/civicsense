const BASE_URL = "https://civicsense-7y58.onrender.com";
/* ---------------- AI CHAT ---------------- */

export async function chatAI(message) {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("AI request failed");
  return res.json();
}

/* ---------------- DASHBOARD ---------------- */

export async function getDashboard() {
  const res = await fetch(`${VITE_API_BASE_URL}/analytics/dashboard`);
  if (!res.ok) throw new Error("Dashboard fetch failed");
  return res.json();
}

/* ---------------- SCHEMES ---------------- */

export async function checkSchemes(profile) {
  const res = await fetch(`${VITE_API_BASE_URL}/schemes/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Scheme eligibility check failed");
  return res.json();
}

/* ---------------- ZONES ---------------- */ 

export async function getZones() {
  const res = await fetch(`${VITE_API_BASE_URL}/zones`);
  if (!res.ok) throw new Error("Zones fetch failed");
  return res.json();
}

/* ---------------- PDF UPLOAD ---------------- */

export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${VITE_API_BASE_URL}/ai/upload-pdf`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("PDF upload failed");
  return res.json();
}
