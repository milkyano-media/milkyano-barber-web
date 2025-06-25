import { apiSquare } from './apiClients';
import { AxiosResponse } from 'axios';
import { CustomerDetail } from '@/interfaces/BookingInterface';
import {
  mockCheckPhone,
  mockRegister,
  mockVerifyRegistration,
  mockLogin,
  mockRequestOTP,
  mockGetCurrentCustomer,
  RegisterPayload,
  RegisterResponse,
  VerifyRegistrationPayload,
  LoginPayload,
  AuthResponse,
  CheckPhonePayload,
  CheckPhoneResponse,
  OTPRequestPayload,
  OTPRequestResponse
} from './mockAuthApi';

// Toggle this for development/testing
const USE_MOCK_API = true;

// Check if phone number exists
export const checkPhone = async (data: CheckPhonePayload): Promise<CheckPhoneResponse> => {
  if (USE_MOCK_API) {
    return mockCheckPhone(data);
  }
  const response: AxiosResponse<CheckPhoneResponse> = await apiSquare.post('/web/auth/check-phone', data);
  return response.data;
};

// Register new customer
export const register = async (data: RegisterPayload): Promise<RegisterResponse> => {
  if (USE_MOCK_API) {
    return mockRegister(data);
  }
  const response: AxiosResponse<RegisterResponse> = await apiSquare.post('/web/auth/register', data);
  return response.data;
};

// Verify registration with OTP
export const verifyRegistration = async (data: VerifyRegistrationPayload): Promise<AuthResponse> => {
  if (USE_MOCK_API) {
    return mockVerifyRegistration(data);
  }
  const response: AxiosResponse<AuthResponse> = await apiSquare.post('/web/auth/register/verify', data);
  return response.data;
};

// Login with phone and password
export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  if (USE_MOCK_API) {
    return mockLogin(data);
  }
  const response: AxiosResponse<AuthResponse> = await apiSquare.post('/web/auth/login', data);
  return response.data;
};

// Request OTP (for various purposes like password reset)
export const requestOTP = async (data: OTPRequestPayload): Promise<OTPRequestResponse> => {
  if (USE_MOCK_API) {
    return mockRequestOTP(data);
  }
  const response: AxiosResponse<OTPRequestResponse> = await apiSquare.post('/web/auth/otp/request', data);
  return response.data;
};

// Get current customer info
export const getCurrentCustomer = async (token: string): Promise<CustomerDetail> => {
  if (USE_MOCK_API) {
    return mockGetCurrentCustomer();
  }
  const response: AxiosResponse<CustomerDetail> = await apiSquare.get('/web/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Re-export types from mockAuthApi
export type {
  RegisterPayload,
  RegisterResponse,
  VerifyRegistrationPayload,
  LoginPayload,
  AuthResponse,
  CheckPhonePayload,
  CheckPhoneResponse,
  OTPRequestPayload,
  OTPRequestResponse
} from './mockAuthApi';