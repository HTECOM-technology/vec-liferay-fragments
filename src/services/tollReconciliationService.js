import dayjs from "dayjs";
import { baseApiUrl } from "@/utils";

const API_PATH = "/o/toll-reconciliation/dashboard";

function getAuthHeaders() {
  const authToken =
    typeof window !== "undefined" && window.Liferay?.authToken
      ? window.Liferay.authToken
      : "";

  return authToken ? { "x-csrf-token": authToken } : {};
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    return { message: text };
  }
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = dayjs(value);

  return date.isValid() ? date.format("DD/MM/YYYY\nHH:mm:ss") : "-";
}

function normalizeChartData(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => ({
      date: String(item?.date || ""),
      value: Number(item?.value || 0),
    }))
    .filter((item) => item.date && Number.isFinite(item.value));
}

function normalizeIncidents(items) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    key: String(item?.id || item?.externalId || `incident-${index}`),
    stt: index + 1,
    loai: item?.incidentType || item?.incidentTitle || "-",
    tuyen: item?.routeName || item?.routeCode || "-",
    tram: item?.stationName || item?.stationCode || "-",
    thoiGian: formatDateTime(item?.occurredAt),
    trangThai: item?.status || "pending",
  }));
}

function normalizeEvents(items) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    key: String(item?.id || item?.externalId || `event-${index}`),
    stt: index + 1,
    tenSuKien: item?.eventName || "-",
    loai: item?.eventType || "-",
    tuyen: item?.routeName || item?.routeCode || "-",
    tram: item?.stationName || item?.stationCode || "-",
    nguoiTao: item?.createdBy || "-",
    ngayTao: formatDateTime(item?.createdAt || item?.occurredAt),
    ngayCapNhat: formatDateTime(item?.updatedAt),
    trangThai: item?.status || "pending",
  }));
}

function normalizeErrors(items) {
  return (Array.isArray(items) ? items : []).map((item, index) => ({
    key: String(item?.id || item?.externalId || `error-${index}`),
    stt: index + 1,
    tenYeuCau: item?.requestName || "-",
    loaiLoi: item?.errorType || "-",
    tuyen: item?.routeName || item?.routeCode || "-",
    tram: item?.stationName || item?.stationCode || "-",
    nguoiTao: item?.createdBy || "-",
    ngayTao: formatDateTime(item?.createdAt || item?.occurredAt),
    ngayCapNhat: formatDateTime(item?.updatedAt),
    trangThai: item?.status || "pending",
  }));
}

export async function fetchTollReconciliationDashboard({ signal, limit = 10 } = {}) {
  const query = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(`${baseApiUrl()}${API_PATH}?${query.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      ...getAuthHeaders(),
    },
    signal,
  });
  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(
      data?.message || "Không thể tải dữ liệu đối soát thu phí."
    );

    error.status = response.status;
    error.data = data;
    throw error;
  }

  return {
    traffic: normalizeChartData(data?.traffic),
    revenue: normalizeChartData(data?.revenue),
    incidents: normalizeIncidents(data?.incidents),
    events: normalizeEvents(data?.events),
    errors: normalizeErrors(data?.errors),
  };
}
