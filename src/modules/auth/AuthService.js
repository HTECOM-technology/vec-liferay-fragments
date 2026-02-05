/**
 * Authentication Service
 * Handles all authentication related operations
 */
class AuthService {
    /**
     * Login to Liferay portal
     * @param {string} username - User's email or username
     * @param {string} password - User's password
     * @returns {Promise<{success: boolean, error?: string, user?: Object}>}
     */
    async login(username, password) {
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
          const user = this.getCurrentUser();
          return { 
            success: true,
            user 
          };
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
      return null;
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
  
  // Export singleton instance
  export default new AuthService();