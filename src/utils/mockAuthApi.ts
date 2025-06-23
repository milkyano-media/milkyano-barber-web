import { CustomerDetail } from '@/interfaces/BookingInterface';

// Types for authentication
export interface RegisterPayload {
  phone_number: string;
  password: string;
  given_name: string;
  family_name: string;
  email_address: string;
}

export interface RegisterResponse {
  requires_otp: boolean;
  session_id: string;
  message: string;
}

export interface VerifyRegistrationPayload {
  session_id: string;
  otp_code: string;
}

export interface LoginPayload {
  phone_number: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  customer: CustomerDetail;
  message?: string;
}

export interface CheckPhonePayload {
  phone_number: string;
}

export interface CheckPhoneResponse {
  exists: boolean;
}

export interface OTPRequestPayload {
  phone_number: string;
}

export interface OTPRequestResponse {
  success: boolean;
  message: string;
  expires_at?: string;
}

// Mock data storage
const mockCustomers: Map<string, {
  customer: CustomerDetail;
  password: string;
}> = new Map();

const mockOTPSessions: Map<string, {
  otp: string;
  expiresAt: number;
  registerData?: RegisterPayload;
  phoneNumber?: string;
}> = new Map();

// Initialize with a test customer
mockCustomers.set('+61412345678', {
  customer: {
    id: 'MOCK_CUSTOMER_123',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    given_name: 'John',
    family_name: 'Doe',
    email_address: 'john.doe@example.com',
    phone_number: '+61412345678',
    preferences: {
      email_unsubscribed: false
    },
    creation_source: 'INSTANT_PROFILE',
    version: 1
  },
  password: 'password123' // In real implementation, this would be hashed
});

// Helper function to generate mock tokens
const generateMockToken = (): string => {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Helper function to generate OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if phone number exists
export const mockCheckPhone = async (data: CheckPhonePayload): Promise<CheckPhoneResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    exists: mockCustomers.has(data.phone_number)
  };
};

// Register new customer
export const mockRegister = async (data: RegisterPayload): Promise<RegisterResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if phone already exists
  if (mockCustomers.has(data.phone_number)) {
    throw new Error('Phone number already registered');
  }
  
  // Generate OTP and session
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  const otp = generateOTP();
  
  mockOTPSessions.set(sessionId, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    registerData: data
  });
  
  console.log(`[MOCK REGISTER] OTP for ${data.phone_number}: ${otp}`);
  
  return {
    requires_otp: true,
    session_id: sessionId,
    message: 'OTP sent successfully'
  };
};

// Verify registration OTP
export const mockVerifyRegistration = async (data: VerifyRegistrationPayload): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const session = mockOTPSessions.get(data.session_id);
  
  if (!session) {
    throw new Error('Session not found or expired');
  }
  
  if (Date.now() > session.expiresAt) {
    mockOTPSessions.delete(data.session_id);
    throw new Error('OTP expired');
  }
  
  if (session.otp !== data.otp_code) {
    return {
      success: false,
      token: '',
      customer: {} as CustomerDetail,
      message: 'Invalid OTP code'
    };
  }
  
  // OTP is valid, create customer
  if (!session.registerData) {
    throw new Error('Invalid session data');
  }
  
  const newCustomer: CustomerDetail = {
    id: `MOCK_CUSTOMER_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    given_name: session.registerData.given_name,
    family_name: session.registerData.family_name,
    email_address: session.registerData.email_address,
    phone_number: session.registerData.phone_number,
    preferences: {
      email_unsubscribed: false
    },
    creation_source: 'INSTANT_PROFILE',
    version: 1
  };
  
  // Store customer with password
  mockCustomers.set(session.registerData.phone_number, {
    customer: newCustomer,
    password: session.registerData.password
  });
  
  // Clean up session
  mockOTPSessions.delete(data.session_id);
  
  return {
    success: true,
    token: generateMockToken(),
    customer: newCustomer
  };
};

// Login with phone and password
export const mockLogin = async (data: LoginPayload): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const customerData = mockCustomers.get(data.phone_number);
  
  if (!customerData) {
    throw new Error('Invalid phone number or password');
  }
  
  if (customerData.password !== data.password) {
    throw new Error('Invalid phone number or password');
  }
  
  return {
    success: true,
    token: generateMockToken(),
    customer: customerData.customer
  };
};

// Request OTP (for forgot password)
export const mockRequestOTP = async (data: OTPRequestPayload): Promise<OTPRequestResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const otp = generateOTP();
  const sessionId = `otp_session_${Date.now()}`;
  
  mockOTPSessions.set(sessionId, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    phoneNumber: data.phone_number
  });
  
  console.log(`[MOCK OTP] Code for ${data.phone_number}: ${otp}`);
  
  return {
    success: true,
    message: 'OTP sent successfully',
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };
};

// Get current customer (validates token)
export const mockGetCurrentCustomer = async (token: string): Promise<CustomerDetail> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For mock purposes, return the first customer
  // In real implementation, would validate token and return associated customer
  const customers = Array.from(mockCustomers.values());
  if (customers.length > 0) {
    return customers[0].customer;
  }
  
  throw new Error('Customer not found');
};