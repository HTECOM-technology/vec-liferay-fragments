import { baseApiUrl } from "@/utils";

/**
 * Authentication Service
 * Handles all authentication related operations
 */
class AuthService {
  /**
   * Login to Liferay portal
   * Uses application/x-www-form-urlencoded and p_auth (CSRF) as required by Liferay.
   * Success = Liferay redirects (response.url leaves login page); failure = 200 with same login URL.
   * @param {string} username - User's email or username
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string, user?: Object}>}
   */
  async login(username, password, rememberMe = false) {
    const baseUrl = baseApiUrl();
    try {
      const params = new URLSearchParams();
      params.append('login', username.trim());
      params.append('password', password);
      params.append('rememberMe', rememberMe ? 'true' : 'false');

      const authToken = this.getAuthToken();
      if (authToken) {
        params.append('p_auth', authToken);
      }

      const redirectPath = encodeURIComponent('/web/guest/intranet');
      const apiLoginUrl = `/web/guest/trangchu?redirectUrl=${redirectPath}&redirect=${redirectPath}&p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&_com_liferay_login_web_portlet_LoginPortlet_javax.portlet.action=%2Flogin%2Flogin&_com_liferay_login_web_portlet_LoginPortlet_mvcRenderCommandName=%2Flogin%2Flogin&p_auth=Ri5BldX9`;
      const response = await fetch(`${baseUrl}${apiLoginUrl}`, {
        method: 'POST',
        body: params.toString(),
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'x-csrf-token': authToken
        }
      });

      const responseUrl = response.url || '';
      const isLoginPage = /\/c\/portal\/login\/?(\?|$)/i.test(responseUrl) || /\/login\/?(\?|$)/i.test(responseUrl);

      if (response.ok && !isLoginPage) {
        const user = this.getCurrentUser();
        return {
          success: true,
          user
        };
      }

      if (response.ok && isLoginPage) {
        let errorMessage = 'Thông tin đăng nhập không chính xác';
        try {
          const text = await response.text();
          if (text && text.length < 5000) {
            if (/password.*invalid|sai|không đúng|incorrect|invalid credentials/i.test(text)) errorMessage = 'Thông tin đăng nhập không chính xác';
            else if (/locked|khóa|lockout/i.test(text)) errorMessage = 'Tài khoản đã bị khóa';
            else if (/expired|hết hạn/i.test(text)) errorMessage = 'Mật khẩu đã hết hạn';
          }
        } catch (_) { }
        return { success: false, error: errorMessage };
      }

      return {
        success: false,
        error: response.status === 401 || response.status === 403
          ? 'Thông tin đăng nhập không chính xác'
          : 'Không thể kết nối đến server. Vui lòng thử lại.'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Không thể kết nối đến server'
      };
    }
  }

  /**
   * Logout from Liferay portal
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      const response = await fetch('/c/portal/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        // Clear any stored data
        this.clearStorage();
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even on error
      window.location.href = '/';
    }
  }

  /**
   * Get current logged in user information
   * @returns {Object|null} User information or null
   */
  getCurrentUser() {
    // Check if Liferay object exists in window
    if (typeof window !== 'undefined' && window.Liferay && window.Liferay.ThemeDisplay) {
      return {
        userId: window.Liferay.ThemeDisplay.getUserId(),
        userName: window.Liferay.ThemeDisplay.getUserName(),
        userEmailAddress: window.Liferay.ThemeDisplay.getUserEmailAddress(),
        isSignedIn: window.Liferay.ThemeDisplay.isSignedIn(),
        companyId: window.Liferay.ThemeDisplay.getCompanyId(),
        scopeGroupId: window.Liferay.ThemeDisplay.getScopeGroupId()
      };
    }

    return null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    if (typeof window !== 'undefined' && window.Liferay && window.Liferay.ThemeDisplay) {
      return window.Liferay.ThemeDisplay.isSignedIn();
    }

    return false;
  }

  /**
   * Get authentication token (CSRF token)
   * @returns {string|null}
   */
  getAuthToken() {
    if (typeof window !== 'undefined' && window.Liferay && window.Liferay.authToken) {
      return window.Liferay.authToken;
    }
    return 'Ri5BldX9';
  }

  /**
   * Clear local storage
   * @private
   */
  clearStorage() {
    try {
      localStorage.removeItem('user');
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Store user data in local storage
   * @param {Object} userData - User data to store
   * @private
   */
  storeUserData(userData) {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  /**
   * Get stored user data from local storage
   * @returns {Object|null}
   */
  getStoredUserData() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user data:', error);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
