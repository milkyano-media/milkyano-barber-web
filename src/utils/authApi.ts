import { apiClient } from './apiClients';
import { AxiosResponse } from 'axios';
import {
  RegisterPayload,
  RegisterResponse,
  RequestOTPResponse,
  VerifyOTPResponse,
  RefreshTokenResponse,
  GetMeResponse,
  LoginPayload,
  LoginResponse
} from '@/interfaces/AuthInterface';

// Register new customer
export const register = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response: AxiosResponse<RegisterResponse> = await apiClient.post('/auth/register', data);
  return response.data;
};

// Login with email/phone and password
export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/login', data);
  return response.data;
};

// Request OTP for existing user
export const requestOTP = async (phoneNumber: string): Promise<RequestOTPResponse> => {
  const response: AxiosResponse<RequestOTPResponse> = await apiClient.post('/auth/request-otp', {
    phoneNumber
  });
  return response.data;
};

// Verify OTP and get tokens
export const verifyOTP = async (phoneNumber: string, otpCode: string): Promise<VerifyOTPResponse> => {
  const response: AxiosResponse<VerifyOTPResponse> = await apiClient.post('/auth/verify-otp', {
    phoneNumber,
    otpCode
  });
  return response.data;
};

// Forgot password (request OTP for account recovery)
export const forgotPassword = async (phoneNumber: string): Promise<RequestOTPResponse> => {
  const response: AxiosResponse<RequestOTPResponse> = await apiClient.post('/auth/forgot-password', {
    phoneNumber
  });
  return response.data;
};

// Update password (requires authentication)
export const updatePassword = async (newPassword: string): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await apiClient.put('/auth/update-password', {
    newPassword
  });
  return response.data;
};

// Refresh access token
export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response: AxiosResponse<RefreshTokenResponse> = await apiClient.post('/auth/refresh', {
    refreshToken
  });
  return response.data;
};

// Get current user info
export const getCurrentUser = async (): Promise<GetMeResponse> => {
  const response: AxiosResponse<GetMeResponse> = await apiClient.get('/auth/me');
  return response.data;
};

// Helper function to check if phone exists (by trying to request OTP)
export const checkPhoneExists = async (phoneNumber: string): Promise<boolean> => {
  try {
    await requestOTP(phoneNumber);
    return true;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

// Google OAuth - Step 1: Verify token and check user status
export const verifyGoogleOAuth = async (idToken: string): Promise<any> => {
  const response: AxiosResponse<any> = await apiClient.post('/auth/google/verify', {
    idToken
  });
  return response.data;
};

// Google OAuth - Step 2: Complete registration with phone number
export const completeGoogleOAuth = async (idToken: string, phoneNumber: string): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/google/complete', {
    idToken,
    phoneNumber
  });
  return response.data;
};

// Apple OAuth - Step 1: Verify token and check user status
export const verifyAppleOAuth = async (idToken: string, authorizationCode?: string): Promise<any> => {
  const response: AxiosResponse<any> = await apiClient.post('/auth/apple/verify', {
    idToken,
    authorizationCode
  });
  return response.data;
};

// Apple OAuth - Step 2: Complete registration with phone number
export const completeAppleOAuth = async (idToken: string, phoneNumber: string): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/apple/complete', {
    idToken,
    phoneNumber
  });
  return response.data;
};

// Helper function to get Square customer ID from localStorage
// Note: This returns the Square customer ID, not the auth user ID
export const getCustomerId = (): string | null => {
  // Always return the Square customer ID from localStorage
  // This is set during the booking process for both authenticated and non-authenticated users
  return localStorage.getItem('customer_id');
};

