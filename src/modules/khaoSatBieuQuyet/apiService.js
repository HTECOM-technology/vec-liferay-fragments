import { baseApiUrl } from "@/utils";

const API_BASE_PATH = "/o/vec-survey";

class KhaoSatBieuQuyetApiService {
  async getSurveys({
    page = 1,
    pageSize = 12,
    search = "",
    status = "",
    filter = "all",
    state = "all",
    orderBy = "desc"
  } = {}) {
    return this.request(
      `/surveys${this.buildQuery({ page, pageSize, search, status, filter, state, orderBy })}`
    );
  }

  async getSurvey(surveyId) {
    return this.request(`/surveys/${encodeURIComponent(surveyId)}`);
  }

  async createSurvey(payload) {
    return this.request("/surveys", {
      method: "POST",
      body: payload
    });
  }

  async updateSurvey(surveyId, payload) {
    return this.request(`/surveys/${encodeURIComponent(surveyId)}`, {
      method: "PUT",
      body: payload
    });
  }

  async deleteSurvey(surveyId) {
    return this.request(`/surveys/${encodeURIComponent(surveyId)}`, {
      method: "DELETE"
    });
  }

  async endSurvey(surveyId) {
    return this.request(`/surveys/${encodeURIComponent(surveyId)}/end`, {
      method: "POST"
    });
  }

  async getSurveyResults(surveyId) {
    return this.request(`/surveys/${encodeURIComponent(surveyId)}/results`);
  }

  async vote(surveyId, optionIds) {
    const payload = Array.isArray(optionIds) ? { optionIds } : optionIds;

    return this.request(`/surveys/${encodeURIComponent(surveyId)}/vote`, {
      method: "POST",
      body: payload
    });
  }

  async getOrganizations({ parentOrganizationId = 0, search = "" } = {}) {
    return this.request(
      `/organizations${this.buildQuery({ parentOrganizationId, search })}`
    );
  }

  async getUsers({
    organizationId = "",
    departmentId = "",
    search = "",
    page,
    pageSize
  } = {}) {
    return this.request(
      `/users${this.buildQuery({ organizationId, departmentId, search, page, pageSize })}`
    );
  }

  async request(path, options = {}) {
    const method = options.method || "GET";
    const headers = {
      "X-Requested-With": "XMLHttpRequest",
      ...this.getAuthHeaders(),
      ...(options.headers || {})
    };

    const fetchOptions = {
      method,
      credentials: "include",
      headers
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      fetchOptions.body =
        typeof options.body === "string" ? options.body : JSON.stringify(options.body);
    }

    const response = await fetch(`${baseApiUrl()}${API_BASE_PATH}${path}`, fetchOptions);
    const data = await this.parseResponse(response);

    if (!response.ok) {
      const error = new Error(this.getErrorMessage(response.status, data));
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  buildQuery(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
  }

  getAuthHeaders() {
    const authToken =
      typeof window !== "undefined" && window.Liferay && window.Liferay.authToken
        ? window.Liferay.authToken
        : "";

    return authToken ? { "x-csrf-token": authToken } : {};
  }

  async parseResponse(response) {
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

  getErrorMessage(status, data) {
    const serverMessage = data?.error || data?.message || "";
    const messageMap = {
      Unauthorized: "Bạn cần đăng nhập để sử dụng chức năng này.",
      Forbidden: "Bạn không có quyền thực hiện thao tác này.",
      "User is not a survey participant": "Bạn không nằm trong danh sách người tham gia bình chọn này.",
      "Survey not found": "Không tìm thấy cuộc bình chọn.",
      "Survey is closed": "Cuộc bình chọn đã kết thúc.",
      "Cuộc bình chọn không còn hoạt động.": "Cuộc bình chọn không còn hoạt động.",
      "Cuộc bình chọn chưa bắt đầu.": "Cuộc bình chọn chưa bắt đầu.",
      "Cuộc bình chọn đã kết thúc.": "Cuộc bình chọn đã kết thúc.",
      "optionIds is required": "Vui lòng chọn phương án bình chọn.",
      "Only one option is allowed": "Cuộc bình chọn này chỉ cho phép chọn một phương án.",
      "title is required": "Vui lòng nhập tên chủ đề.",
      "At least two options are required": "Vui lòng nhập ít nhất hai phương án.",
      "Không thể chỉnh sửa cuộc bình chọn đã có người tham gia.": "Không thể chỉnh sửa cuộc bình chọn đã có người tham gia.",
      "Không thể xóa cuộc bình chọn đã có người tham gia.": "Không thể xóa cuộc bình chọn đã có người tham gia.",
      "Internal server error": "Máy chủ đang gặp lỗi. Vui lòng thử lại sau."
    };

    if (serverMessage.startsWith("Invalid optionId")) {
      return "Phương án bình chọn không hợp lệ.";
    }

    if (messageMap[serverMessage]) {
      return messageMap[serverMessage];
    }

    if (status === 401) {
      return "Bạn cần đăng nhập để sử dụng chức năng này.";
    }

    if (status === 403) {
      return "Bạn không có quyền thực hiện thao tác này.";
    }

    return serverMessage || "Không thể kết nối đến server. Vui lòng thử lại.";
  }
}

const khaoSatBieuQuyetApiService = new KhaoSatBieuQuyetApiService();

export default khaoSatBieuQuyetApiService;
