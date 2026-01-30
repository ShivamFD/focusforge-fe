import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Note: Using jwt-decode package
import { authAPI } from '../services/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if token exists and is valid
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Set token in localStorage
  const setToken = (token) => {
    localStorage.setItem('token', token);
  };

  // Remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem('token');
  };

  // Validate token and get user info
  const validateToken = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      removeToken();
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      const userData = response.data.data.user;

      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Token validation failed:', error);
      removeToken();
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data.data;

      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const response = await authAPI.getMe();
      const userData = response.data.data.user;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      logout();
      return null;
    }
  };

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // Check authentication status periodically to handle token expiration
  useEffect(() => {
    let intervalId;

    if (isAuthenticated) {
      // Check token validity every minute
      intervalId = setInterval(() => {
        const token = getToken();
        if (token && isTokenExpired(token)) {
          logout();
        }
      }, 60000); // Every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUserData,
    getToken,
    isTokenExpired: () => isTokenExpired(getToken()),
    validateToken
  };
};

export default useAuth;