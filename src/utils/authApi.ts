import { apiClient } from './apiClients';
import { AxiosResponse } from 'axios';
import {
  RegisterPayload,
  RegisterResponse,
  RequestOTPPayload,
  RequestOTPResponse,
  VerifyOTPPayload,
  VerifyOTPResponse,
  RefreshTokenPayload,
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