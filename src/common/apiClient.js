/**
 * Unified API client.
 *
 * Set REACT_APP_USE_FIREBASE=true  → uses Firebase Realtime Database (fake API)
 * Set REACT_APP_USE_FIREBASE=false → uses axiosPrivate (real Liferay/Java API)
 *
 * All service files import ONLY this client.
 * Migration to real API = flip the env var. No service code changes needed.
 *
 * @example
 * import apiClient from "../common/apiClient";
 * const { data } = await apiClient.get("/news");
 */

import { axiosPrivate } from "./axios";
import firebaseClient from "../services/firebase/firebaseClient";

const USE_FIREBASE = process.env.REACT_APP_USE_FIREBASE === "true";

const apiClient = USE_FIREBASE ? firebaseClient : axiosPrivate;

export default apiClient;
