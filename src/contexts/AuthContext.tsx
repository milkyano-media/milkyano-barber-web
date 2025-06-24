import React, { useState, useEffect } from 'react';
import { CustomerDetail } from '@/interfaces/BookingInterface';
import { AuthContext } from './AuthContextDefinition';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('auth_token');
    const customerData = localStorage.getItem('auth_customer');
    
    if (token && customerData) {
      try {
        const parsedCustomer = JSON.parse(customerData);
        setAuthToken(token);
        setCustomer(parsedCustomer);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored customer data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_customer');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (token: string, customerData: CustomerDetail) => {
    setAuthToken(token);
    setCustomer(customerData);
    setIsAuthenticated(true);
    
    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_customer', JSON.stringify(customerData));
  };

  const logout = () => {
    setAuthToken(null);
    setCustomer(null);
    setIsAuthenticated(false);
    
    // Clear from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_customer');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        customer,
        authToken,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};