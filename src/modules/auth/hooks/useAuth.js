import { useState, useEffect } from 'react';
import AuthService from '../AuthService';

/**
 * Custom hook for authentication
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   */
  const checkAuth = () => {
    try {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
      } else {
        // Check stored user data
        const storedUser = AuthService.getStoredUserData();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @returns {Promise<Object>}
   */
  const login = async (username, password) => {
    setLoading(true);
    try {
      const result = await AuthService.login(username, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
};

export default useAuth;