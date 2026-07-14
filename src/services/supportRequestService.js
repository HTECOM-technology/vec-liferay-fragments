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
      data?.error || data?.message || "Không thể xử lý yêu cầu hỗ trợ."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

function normalizeUser(user) {
  const userId = Number(user?.userId || 0);
  const name =
    user?.fullName ||
    user?.screenName ||
    user?.emailAddress ||
    String(userId);
  const unitParts = [user?.organizationName, user?.departmentName].filter(
    Boolean
  );

  return {
    ...user,
    userId,
    value: userId,
    label: unitParts.length ? `${name} (${unitParts.join(" - ")})` : name,
  };
}

function normalizeDateTime(value) {
  if (!value) {
    return "";
  }

  return String(value).replace(
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})(?:\.\d+)?$/,
    "$1T$2"
  );
}

function normalizeRequest(item) {
  const handlers = (item?.handlers || []).map(normalizeUser);
  const followers = (item?.followers || []).map(normalizeUser);

  return {
    ...item,
    id: Number(item?.requestId || 0),
    requestId: Number(item?.requestId || 0),
    handlers,
    followers,
    handler: handlers.map((user) => user.label).join(", "),
    watcher: followers.map((user) => user.label).join(", "),
    dueDate: normalizeDateTime(item?.dueDate),
    startDate: normalizeDateTime(item?.startDate),
    endDate: normalizeDateTime(item?.endDate),
    createDate: normalizeDateTime(item?.createDate),
    modifiedDate: normalizeDateTime(item?.modifiedDate),
    comments: (item?.comments || []).map((comment) => ({
      ...comment,
      createDate: normalizeDateTime(comment.createDate),
    })),
    attachments: (item?.attachments || []).map((attachment) => ({
      ...attachment,
      createDate: normalizeDateTime(attachment.createDate),
    })),
    statusHistory: (item?.statusHistory || []).map((history) => ({
      ...history,
      createDate: normalizeDateTime(history.createDate),
    })),
  };
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  if (typeof value.format === "function") {
    return value.format("YYYY-MM-DD HH:mm:ss");
  }

  return String(value);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const separatorIndex = result.indexOf(",");

      resolve(separatorIndex >= 0 ? result.slice(separatorIndex + 1) : result);
    };
    reader.onerror = () => reject(new Error(`Không đọc được tệp ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

async function normalizeAttachments(fileList = []) {
  return Promise.all(
    fileList.map(async (uploadFile) => {
      const file = uploadFile.originFileObj || uploadFile;

      if (!(file instanceof File)) {
        throw new Error(`Tệp ${uploadFile.name || "đính kèm"} không hợp lệ.`);
      }

      return {
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        fileSize: file.size,
        base64Content: await fileToBase64(file),
      };
    })
  );
}

export async function fetchSupportRequests(params = {}) {
  const data = await request(`/requests${buildQuery(params)}`);

  return {
    ...data,
    items: (data?.items || []).map(normalizeRequest),
    total: Number(data?.total || 0),
  };
}

export async function fetchSupportRequest(requestId) {
  const data = await request(`/requests/${encodeURIComponent(requestId)}`);

  return normalizeRequest(data || {});
}

export async function createSupportRequest(formData) {
  const attachments = await normalizeAttachments(formData.attachments || []);
  const data = await request("/requests", {
    method: "POST",
    body: {
      processKey: formData.process,
      requestTypeKey: formData.subProcess,
      title: formData.title,
      content: formData.content || "",
      priority: formData.priority,
      notificationTypes: formData.notifications || [],
      dueDate: formatDateTime(formData.dueDate),
      startDate: formatDateTime(formData.startDate),
      endDate: formatDateTime(formData.endDate),
      periodType: formData.periodType || "",
      followerIds: (formData.followers || []).map(Number),
      attachments,
    },
  });

  return normalizeRequest(data || {});
}

export async function updateSupportRequestStatus(requestId, status) {
  const data = await request(
    `/requests/${encodeURIComponent(requestId)}/status`,
    {
      method: "PUT",
      body: { status },
    }
  );

  return normalizeRequest(data || {});
}

export async function addSupportRequestComment(requestId, content) {
  const data = await request(`/requests/${encodeURIComponent(requestId)}/comments`, {
    method: "POST",
    body: { content },
  });

  return {
    ...data,
    createDate: normalizeDateTime(data?.createDate),
  };
}

export async function fetchSupportRequestUsers(search = "") {
  const data = await request(`/request-users${buildQuery({ search })}`);

  return (data?.items || []).map(normalizeUser);
}

export function getSupportAttachmentUrl(requestId, attachmentId) {
  return `${baseApiUrl()}${API_BASE_PATH}/requests/${encodeURIComponent(
    requestId
  )}/attachments/${encodeURIComponent(attachmentId)}`;
}
