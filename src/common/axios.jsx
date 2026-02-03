import axios from "axios";

/**
 * Pre-configured Axios instance for authenticated requests in Liferay.
 *
 * Uses the current portal origin as the base URL and automatically
 * attaches required headers such as JSON content type and Liferay CSRF token.
 *
 * @constant axiosPrivate
 * @type {import("axios").AxiosInstance}
 *
 * @example
 * const response = await axiosPrivate.get("/o/headless-delivery/v1.0/sites");
 */
export const axiosPrivate = axios.create({
  baseURL: window.location.origin,
  headers: {
    "Content-Type": "application/json",
    "x-csrf-token": Liferay.authToken,
  },
});
