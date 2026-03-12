const DB_URL = process.env.REACT_APP_FIREBASE_DB_URL;
const DB_PATH = process.env.REACT_APP_FIREBASE_DB_PATH || "dashboard-layout";

function getEndpoint() {
  if (!DB_URL) {
    console.warn("[Dashboard] REACT_APP_FIREBASE_DB_URL is not configured.");
    return null;
  }
  return `${DB_URL}/${DB_PATH}.json`;
}

export async function fetchLayoutFromFirebase() {
  const endpoint = getEndpoint();
  if (!endpoint) return null;
  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveLayoutToFirebase(layout) {
  const endpoint = getEndpoint();
  if (!endpoint) return;
  try {
    await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(layout),
    });
  } catch (e) {
    console.error("[Dashboard] Failed to save layout to Firebase:", e);
  }
}
