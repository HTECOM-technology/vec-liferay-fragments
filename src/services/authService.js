const authService = {
  /**
   * Login to Liferay portal
   * @param {string} username - User's email or username
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  login: async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('login', username);
      formData.append('password', password);
      formData.append('rememberMe', false);

      const response = await fetch('/c/portal/login', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Thông tin đăng nhập không chính xác' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Không thể kết nối đến server' 
      };
    }
  },

  /**
   * Logout from Liferay portal
   */
  logout: async () => {
    try {
      const response = await fetch('/c/portal/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  },

  /**
   * Get current logged in user information
   * @returns {Object|null} User information or null
   */
  getCurrentUser: () => {
    // Check if Liferay object exists in window
    if (typeof window !== 'undefined' && window.Liferay && window.Liferay.ThemeDisplay) {
      return {
        userId: window.Liferay.ThemeDisplay.getUserId(),
        userName: window.Liferay.ThemeDisplay.getUserName(),
        userEmailAddress: window.Liferay.ThemeDisplay.getUserEmailAddress(),
        isSignedIn: window.Liferay.ThemeDisplay.isSignedIn()
      };
    }
    
    return null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    if (typeof window !== 'undefined' && window.Liferay && window.Liferay.ThemeDisplay) {
      return window.Liferay.ThemeDisplay.isSignedIn();
    }
    
    return false;
  },

  /**
   * Get authentication token (CSRF token)
   * @returns {string|null}
   */
  getAuthToken: () => {
    if (typeof window !== 'undefined' && window.Liferay && window.Liferay.authToken) {
      return window.Liferay.authToken;
    }
    return null;
  }
};

export default authService;