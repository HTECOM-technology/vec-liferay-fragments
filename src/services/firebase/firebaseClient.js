/**
 * Firebase Realtime Database REST client.
 *
 * Exposes the same interface as axios (get/post/put/patch/delete),
 * so callers can swap to axiosPrivate later with zero changes.
 *
 * Firebase path convention mirrors the future real API path:
 *   apiClient.get("/news")  →  GET  {DB_URL}/api/news.json
 *   apiClient.post("/news", data) →  POST {DB_URL}/api/news.json  (generates key)
 *   apiClient.put("/news/123", data) → PUT {DB_URL}/api/news/123.json
 *   apiClient.delete("/news/123")  → DELETE {DB_URL}/api/news/123.json
 */

const DB_URL = process.env.REACT_APP_FIREBASE_DB_URL;
const API_PREFIX = "api"; // root node in Firebase that holds all fake API data

function buildUrl(path) {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${DB_URL}/${API_PREFIX}/${cleanPath}.json`;
}

/**
 * Normalise Firebase response to match the axios response shape:
 *   { data: <payload>, status: 200 }
 *
 * Firebase GET returns:
 *   - object with push-keys  → convert to array
 *   - plain value (array, primitive, null)
 */
function normaliseResponse(raw) {
  if (raw === null || raw === undefined) {
    return { data: null };
  }

  // If Firebase returned an object whose keys look like push-keys (e.g. "-N…")
  // convert to an array so callers don't need to handle both shapes.
  // if (
  //   typeof raw === "object" &&
  //   !Array.isArray(raw) &&
  //   Object.keys(raw).length > 0 &&
  //   Object.keys(raw)[0].startsWith("-")
  // ) {
  //   return { data: Object.values(raw) };
  // }

  return { data: raw };
}

async function request(method, path, payload = undefined) {
  if (!DB_URL) {
    console.warn("[firebaseClient] REACT_APP_FIREBASE_DB_URL is not set.");
    return { data: null };
  }

  const url = buildUrl(path);
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (payload !== undefined) {
    options.body = JSON.stringify(payload);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const err = new Error(`[firebaseClient] ${method} ${path} → HTTP ${res.status}`);
    err.response = { status: res.status };
    throw err;
  }

  const raw = await res.json();
  return { ...normaliseResponse(raw), status: res.status };
}

const firebaseClient = {
  /** GET /path  →  Firebase GET */
  get: (path) => request("GET", path),

  /** POST /path  →  Firebase POST (auto-generates push key) */
  post: (path, data) => request("POST", path, data),

  /** PUT /path  →  Firebase PUT (overwrite entire node) */
  put: (path, data) => request("PUT", path, data),

  /** PATCH /path  →  Firebase PATCH (partial update) */
  patch: (path, data) => request("PATCH", path, data),

  /** DELETE /path  →  Firebase DELETE */
  delete: (path) => request("DELETE", path),
};

export default firebaseClient;
