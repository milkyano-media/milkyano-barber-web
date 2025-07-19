export interface BookingEventData {
  bookingId: string;
  amount: number;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isNewCustomer?: boolean;
  };
  teamMember: {
    id: string;
    name: string;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
  startAt: string;
  createdAt: string;
  status: string;
  customerNote?: string;
  source?: string;
}

export interface BookingEventProperties {
  booking: {
    id: string;
    amount: number;
    status: string;
    startAt: string;
    createdAt: string;
    customerNote?: string;
    source: string;
  };
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isNewCustomer?: boolean;
  };
  teamMember: {
    id: string;
    name: string;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
  attribution: {
    trafficSource: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    fbclid: string | null;
  };
}

// Registration event interfaces
export interface RegistrationUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface RegistrationSource {
  page: string;
  referrer: string;
  registrationTrigger: 'manual' | 'booking_flow' | 'header_cta';
}

export interface NeedVerificationEventData {
  user: RegistrationUserData;
  source: RegistrationSource;
  attribution: {
    trafficSource: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    fbclid: string | null;
  };
  timestamp: string;
}

export interface CompletedUserData {
  userId: string;
  phoneNumber: string;
  isNewCustomer: boolean;
}

export interface VerificationData {
  method: 'otp';
  attemptCount: number;
  timeToVerify: number;
}

export interface CompletionSource {
  registrationPath: 'direct' | 'booking_flow';
  redirectTo: string;
}

export interface RegistrationCompletedEventData {
  user: CompletedUserData;
  verification: VerificationData;
  source: CompletionSource;
  attribution: {
    trafficSource: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    fbclid: string | null;
  };
  timestamp: string;
}

export interface RegistrationFailedEventData {
  user: {
    phoneNumber: string;
    registrationId?: string;
  };
  failure: {
    reason: 'verification_timeout' | 'user_abandoned' | 'navigation_away' | 'max_attempts_exceeded';
    timeToFailure: number;
    attemptCount: number;
    lastAttemptAt: string;
  };
  source: {
    registrationPath: 'direct' | 'booking_flow';
    currentPage: string;
    targetPage?: string;
  };
  attribution: {
    trafficSource: string;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    fbclid: string | null;
  };
  timestamp: string;
}
