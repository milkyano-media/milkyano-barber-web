import React, { useState, useEffect, useCallback } from "react";
import { UserData } from "@/interfaces/AuthInterface";
import { AuthContext } from "./AuthContextDefinition";
import {
  refreshAccessToken as refreshTokenAPI,
  getCurrentUser
} from "@/utils/authApi";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to validate and load user from token
  const loadUserFromToken = useCallback(async () => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (!storedAccessToken || !storedRefreshToken) {
      setIsLoading(false);
      return;
    }

    // First, load user from localStorage for immediate UI update
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }

    try {
      // Then verify with API to ensure data is fresh
      const userData = await getCurrentUser();

      setUser(userData);
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);
      
      // Update localStorage with fresh data
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error loading user:", error);

      // If token is expired, try to refresh
      if (
        error instanceof Error &&
        "response" in error &&
        (error as any).response?.status === 401 &&
        storedRefreshToken
      ) {
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

  // Listen for storage changes to sync auth state
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const updatedUser = JSON.parse(e.newValue);
          setUser(updatedUser);
        } catch (error) {
          console.error("Error parsing updated user data:", error);
        }
      } else if ((e.key === 'accessToken' || e.key === 'refreshToken') && !e.newValue) {
        // If tokens are removed, logout
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (newAccessToken: string, userData: UserData) => {
    setAccessToken(newAccessToken);
    setUser(userData);
    setIsAuthenticated(true);

    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Token will be automatically added by the interceptor from localStorage
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirect to home if on protected or auth-related routes
    if (
      window.location.pathname.includes("/account") ||
      window.location.pathname.includes("/bookings") ||
      window.location.pathname.includes("/verify-otp") ||
      window.location.pathname.includes("/change-phone-number") ||
      window.location.pathname.includes("/forgot-password") ||
      window.location.pathname.includes("/book/thank-you")
    ) {
      window.location.href = "/";
    }
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken =
      refreshToken || localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await refreshTokenAPI(storedRefreshToken);

      // Update tokens
      setAccessToken(response.accessToken);
      localStorage.setItem("accessToken", response.accessToken);

      // Token will be automatically added by the interceptor
      return;
    } catch (error) {
      console.error("Error refreshing token:", error);
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
