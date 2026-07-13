import { baseApiUrl } from "@/utils";

const API_BASE_PATH = "/o/vec-support-handler-settings";

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
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }

  const response = await fetch(
    `${baseApiUrl()}${API_BASE_PATH}${path}`,
    fetchOptions
  );
  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(
      data?.error ||
        data?.message ||
        "Không thể tải cấu hình người xử lý."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

function normalizeUser(user) {
  const userId = Number(user?.userId || 0);

  return {
    ...user,
    userId,
    value: userId,
    label:
      user?.fullName ||
      user?.screenName ||
      user?.emailAddress ||
      String(userId),
  };
}

function normalizeConfiguration(item) {
  return {
    ...item,
    configured: item?.configured === true,
    organizationId: Number(item?.organizationId || 0),
    departmentId: Number(item?.departmentId || 0),
    userIds: (item?.userIds || []).map(Number).filter(Boolean),
    users: (item?.users || []).map(normalizeUser),
  };
}

export async function fetchSupportHandlerConfigurations() {
  const data = await request("/configurations");

  return (data?.items || []).map(normalizeConfiguration);
}

export async function fetchSupportHandlerAssignment(
  processKey,
  requestTypeKey
) {
  const data = await request(
    `/assignment${buildQuery({ processKey, requestTypeKey })}`
  );

  return normalizeConfiguration(data || {});
}

export async function fetchSupportOrganizations(parentOrganizationId = 0) {
  const data = await request(
    `/organizations${buildQuery({ parentOrganizationId })}`
  );

  return (data?.items || []).map((item) => ({
    ...item,
    organizationId: Number(item.organizationId),
    value: Number(item.organizationId),
    label: item.name,
  }));
}

export async function fetchSupportHandlerUsers(
  organizationId,
  departmentId
) {
  const data = await request(
    `/users${buildQuery({ organizationId, departmentId })}`
  );

  return (data?.items || []).map(normalizeUser);
}

export async function saveSupportHandlerConfigurations(items = []) {
  const data = await request("/configurations", {
    method: "PUT",
    body: {
      items: items.map((item) => ({
        processKey: item.processKey,
        requestTypeKey: item.requestTypeKey,
        organizationId: Number(item.organizationId),
        departmentId: Number(item.departmentId),
        userIds: (item.userIds || []).map(Number),
      })),
    },
  });

  return {
    ...data,
    items: (data?.items || []).map(normalizeConfiguration),
  };
}
