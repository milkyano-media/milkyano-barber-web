import React, { useState, useEffect, useCallback } from 'react';
import { UserData } from '@/interfaces/AuthInterface';
import { AuthContext } from './AuthContextDefinition';
import { refreshAccessToken as refreshTokenAPI, getCurrentUser } from '@/utils/authApi';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to validate and load user from token
  const loadUserFromToken = useCallback(async () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedAccessToken || !storedRefreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to get current user (token will be added by interceptor)
      const userData = await getCurrentUser();
      
      setUser(userData);
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading user:', error);
      
      // If token is expired, try to refresh
      if (error instanceof Error && 'response' in error && (error as any).response?.status === 401 && storedRefreshToken) {
        try {
          await refreshAccessToken();
        } catch (refreshError) {
          // Clear invalid tokens
          logout();
        }
      } else {
        // Clear invalid tokens
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = (newAccessToken: string, userData: UserData) => {
    setAccessToken(newAccessToken);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Token will be automatically added by the interceptor from localStorage
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to home if on protected route
    if (window.location.pathname.includes('/account') || window.location.pathname.includes('/bookings')) {
      window.location.href = '/';
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken = refreshToken || localStorage.getItem('refreshToken');
    
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await refreshTokenAPI(storedRefreshToken);
      
      // Update tokens
      setAccessToken(response.accessToken);
      localStorage.setItem('accessToken', response.accessToken);
      
      // Token will be automatically added by the interceptor
      return;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        isLoading,
        refreshAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};