import { baseApiUrl } from "@/utils";

const API_BASE_PATH = "/o/vec-setting-camera-show-state";

export const CAMERA_SHOW_STATE_MODES = {
  INTERNET: "internet",
  INTRANET: "intranet",
};

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

async function request(path = "", options = {}) {
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
    const error = new Error(data?.error || data?.message || "Không thể tải cấu hình camera.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getCameraIdentity(camera) {
  return String(camera?.camera_id ?? camera?.id ?? "").trim();
}

export function getCameraName(camera) {
  return camera?.name || "Camera";
}

export function createCameraShowStateMap(items = []) {
  return new Map(
    (items || [])
      .filter((item) => item?.cameraId)
      .map((item) => [
        String(item.cameraId),
        {
          cameraId: String(item.cameraId),
          internetVisible: item.internetVisible !== false,
          intranetVisible: item.intranetVisible !== false,
        },
      ])
  );
}

export function mergeCameraShowState(cameras = [], items = []) {
  const settingsMap = createCameraShowStateMap(items);

  return cameras
    .map((camera) => {
      const cameraId = getCameraIdentity(camera);

      if (!cameraId) {
        return null;
      }

      const setting = settingsMap.get(cameraId);

      return {
        cameraId,
        cameraName: getCameraName(camera),
        internetVisible: setting?.internetVisible !== false,
        intranetVisible: setting?.intranetVisible !== false,
      };
    })
    .filter(Boolean);
}

export function filterCamerasByShowState(
  cameras = [],
  items = [],
  mode = CAMERA_SHOW_STATE_MODES.INTRANET
) {
  const settingsMap = createCameraShowStateMap(items);
  const visibleKey =
    mode === CAMERA_SHOW_STATE_MODES.INTERNET ? "internetVisible" : "intranetVisible";

  return cameras.filter((camera) => {
    const cameraId = getCameraIdentity(camera);

    if (!cameraId) {
      return false;
    }

    const setting = settingsMap.get(cameraId);

    if (!setting) {
      return true;
    }

    return setting[visibleKey] !== false;
  });
}

export async function fetchCameraShowState(highwayId) {
  if (!highwayId) {
    return { highwayId: 0, items: [] };
  }

  try {
    return await request(`?highwayId=${encodeURIComponent(highwayId)}`);
  } catch (error) {
    console.error("[CameraShowState] Failed to fetch camera settings:", error);
    return { highwayId: Number(highwayId) || 0, items: [] };
  }
}

export async function saveCameraShowState(highwayId, items = []) {
  return request("", {
    method: "PUT",
    body: {
      highwayId,
      items: (items || []).map((item) => ({
        cameraId: String(item.cameraId),
        internetVisible: item.internetVisible !== false,
        intranetVisible: item.intranetVisible !== false,
      })),
    },
  });
}
