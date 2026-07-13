import axios from "axios";

const TTNS_API_ALIAS = "/ttns";
const DEFAULT_PAGE_SIZE = 200;

const TTNS_API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
const TTNS_API_USERNAME = process.env.REACT_APP_TTNS_API_USERNAME || "";
const TTNS_API_PASSWORD = process.env.REACT_APP_TTNS_API_PASSWORD || "";

const ttnsApiClient = axios.create({
  baseURL: `${TTNS_API_DOMAIN}${TTNS_API_ALIAS}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 6000,
});

ttnsApiClient.interceptors.request.use((config) => {
  if (TTNS_API_USERNAME || TTNS_API_PASSWORD) {
    config.auth = {
      username: TTNS_API_USERNAME,
      password: TTNS_API_PASSWORD,
    };
  }

  return config;
});

export const ttnsService = {
  async getEmployees({ q = "", page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
    const response = await ttnsApiClient.get("/api/employees", {
      params: {
        q: q || undefined,
        page,
        page_size: pageSize,
      },
    });

    return response.data;
  },

  async getAllEmployees({ q = "" } = {}) {
    let page = 1;
    let total = 0;
    const items = [];

    do {
      const data = await this.getEmployees({
        q,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });

      total = Number(data?.total) || 0;
      items.push(...(data?.items || []));
      page += 1;
    } while (items.length < total && page <= 100);

    return items;
  },

  async getDepartments({ q = "" } = {}) {
    const response = await ttnsApiClient.get("/api/departments", {
      params: {
        q: q || undefined,
      },
    });

    return response.data?.items || [];
  },

  async getPositions({ q = "" } = {}) {
    const response = await ttnsApiClient.get("/api/positions", {
      params: {
        q: q || undefined,
      },
    });

    return response.data?.items || [];
  },

  async getUnreadCountByGroup({ userId } = {}) {
    const response = await ttnsApiClient.get("/api/notifications/unread-count-by-group", {
      params: {
        user_id: userId,
      },
    });

    return response.data;
  },

  async getUnreadCount({ userId } = {}) {
    const response = await ttnsApiClient.get("/api/notifications/unread-count", {
      params: {
        user_id: userId,
      },
    });

    return response.data;
  },

  async getNotifications({ userId, q = "", page = 1, pageSize = 20 } = {}) {
    const response = await ttnsApiClient.get("/api/notifications", {
      params: {
        user_id: userId,
        q: q || undefined,
        page,
        page_size: pageSize,
      },
    });

    return response.data;
  },

  async markNotificationRead({ code, userId } = {}) {
    const response = await ttnsApiClient.post("/api/notifications/mark-read", null, {
      params: {
        code,
        user_id: userId,
      },
    });

    return response.data;
  },

  getErrorMessage(error) {
    const detail = error?.response?.data?.detail;

    if (detail) {
      return detail;
    }

    if (error?.code === "ECONNABORTED") {
      return "Kết nối tới API TTNS bị quá thời gian.";
    }

    if (error?.message) {
      return error.message;
    }

    return "Không thể tải dữ liệu từ API TTNS.";
  },
};
