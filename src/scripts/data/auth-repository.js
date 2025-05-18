import api from "./api.js";
import API_CONFIG from "../config/api-config.js";

class AuthRepository {
    constructor() {
        this._authStorageKey = "auth_token";
        this._userDataKey = "user_data";
    }

    async register({ name, email, password }) {
        return api.post(
            API_CONFIG.ENDPOINTS.REGISTER,
            { name, email, password },
            false
        );
    }

    async login({ email, password }) {
        const response = await api.post(
            API_CONFIG.ENDPOINTS.LOGIN,
            { email, password },
            false
        );

        if (response.loginResult) {
            this._saveAuthData(response.loginResult);
        }

        return response;
    }

    logout() {
        localStorage.removeItem(this._authStorageKey);
        localStorage.removeItem(this._userDataKey);
        window.dispatchEvent(new Event("user-logged-out"));
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    getToken() {
        return localStorage.getItem(this._authStorageKey);
    }

    getUserData() {
        const userData = localStorage.getItem(this._userDataKey);
        return userData ? JSON.parse(userData) : null;
    }

    _saveAuthData(loginResult) {
        const { token, userId, name } = loginResult;
        localStorage.setItem(this._authStorageKey, token);
        localStorage.setItem(this._userDataKey, JSON.stringify({ userId, name }));
        window.dispatchEvent(new Event("user-logged-in"));
    }
}

const authRepository = new AuthRepository();
export default authRepository;
