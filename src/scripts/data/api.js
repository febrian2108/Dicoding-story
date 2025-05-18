import axios from "axios";
import API_CONFIG from "../config/api-config.js";

class Api {
  constructor() {
    this._client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    this._client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan pada server";
        return Promise.reject(new Error(message));
      }
    );
  }

  _getToken() {
    return localStorage.getItem("auth_token");
  }

  _getAuthHeader() {
    const token = this._getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get(url, params = {}, auth = true) {
    const headers = auth ? this._getAuthHeader() : {};
    return this._client.get(url, { params, headers });
  }

  async post(url, data = {}, auth = true) {
    const headers = auth ? this._getAuthHeader() : {};
    return this._client.post(url, data, { headers });
  }

  async postForm(url, formData, auth = true) {
    const headers = auth ? this._getAuthHeader() : {};
    return this._client.post(url, formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async delete(url, data = {}, auth = true) {
    const headers = auth ? this._getAuthHeader() : {};
    return this._client.delete(url, { headers, data });
  }
}

const api = new Api();
export default api;
