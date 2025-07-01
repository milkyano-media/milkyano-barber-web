// Authentication interfaces for OTP-based auth flow

export interface RegisterPayload {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
}

export interface RegisterResponse {
  userId: string;
  phoneNumber: string;
  message: string;
}

export interface RequestOTPPayload {
  phoneNumber: string;
}

export interface RequestOTPResponse {
  message: string;
}

export interface VerifyOTPPayload {
  phoneNumber: string;
  otpCode: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserData {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyOTPResponse extends AuthTokens {
  user: UserData;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user: UserData;
}

export interface GetMeResponse extends UserData {}

// Error response interface
export interface ErrorResponse {
  error: string;
  statusCode?: number;
}

// Auth state for context
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Auth context methods
export interface AuthContextValue extends AuthState {
  register: (data: RegisterPayload) => Promise<RegisterResponse>;
  requestOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otpCode: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}