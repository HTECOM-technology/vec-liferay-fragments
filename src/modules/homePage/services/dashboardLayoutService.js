import { baseApiUrl } from "@/utils";

const API_BASE_PATH = "/o/vec-dashboard-layout";

function getAuthHeaders() {
  const authToken =
    typeof window !== "undefined" && window.Liferay?.authToken
      ? window.Liferay.authToken
      : "";

  return authToken ? { "x-csrf-token": authToken } : {};
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (_) {
    return { message: text };
  }
}

async function request(path, options = {}) {
  const method = options.method || "GET";
  const headers = {
    "X-Requested-With": "XMLHttpRequest",
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method,
    credentials: "include",
    headers,
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body =
      typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(`${baseApiUrl()}${API_BASE_PATH}${path}`, fetchOptions);
  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(data?.error || data?.message || "Không thể lưu bố cục dashboard.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function fetchLayoutFromApi() {
  try {
    return await request("/layout");
  } catch (error) {
    console.error("[Dashboard] Failed to fetch dashboard layout:", error);
    return null;
  }
}

export async function saveLayoutToApi(layout) {
  try {
    return await request("/layout", {
      method: "PUT",
      body: layout,
    });
  } catch (error) {
    console.error("[Dashboard] Failed to save dashboard layout:", error);
    return null;
  }
}

export async function resetLayoutApi() {
  try {
    return await request("/layout", {
      method: "DELETE",
    });
  } catch (error) {
    console.error("[Dashboard] Failed to reset dashboard layout:", error);
    return null;
  }
}
