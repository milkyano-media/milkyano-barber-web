import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { EVENT_TYPES } from '@/constants/event.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKey.constants';
import { 
  BookingEventData, 
  BookingEventProperties,
  RegistrationUserData,
  RegistrationSource,
  NeedVerificationEventData,
  CompletedUserData,
  VerificationData,
  CompletionSource,
  RegistrationCompletedEventData,
  RegistrationFailedEventData
} from '@/interfaces/EventInterface';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Initialize dayjs plugins for timezone handling
dayjs.extend(utc);
dayjs.extend(timezone);

// Base URL for the events API
const EVENTS_API_URL = `${
  import.meta.env.VITE_NEW_API as string
}/api/v2/events`;

// Default Melbourne timezone
const MELBOURNE_TIMEZONE = 'Australia/Melbourne';

/**
 * Determine the traffic source based on URL parameters
 */
const getTrafficSource = (): string => {
  const fbclid = localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID);
  const utmSource = localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE);

  if (fbclid) return 'FACEBOOK';
  if (utmSource && utmSource !== 'None') return utmSource;
  return 'DIRECT';
};

/**
 * Generate or retrieve the unique visitor ID
 */
const getUniqueVisitorId = (): string => {
  let visitorId = localStorage.getItem(LOCAL_STORAGE_KEYS.UNIQUE_VISITOR_ID);

  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(LOCAL_STORAGE_KEYS.UNIQUE_VISITOR_ID, visitorId);
  }

  return visitorId;
};

/**
 * Generate or retrieve the current conversion sequence ID
 */
const getConversionSequenceId = (): string => {
  let sequenceId = localStorage.getItem(
    LOCAL_STORAGE_KEYS.CONVERSION_SEQUENCE_ID
  );

  if (!sequenceId) {
    sequenceId = uuidv4();
    localStorage.setItem(LOCAL_STORAGE_KEYS.CONVERSION_SEQUENCE_ID, sequenceId);
  }

  return sequenceId;
};

/**
 * Reset the conversion sequence ID (called after booking)
 */
const resetConversionSequenceId = (): void => {
  const newSequenceId = uuidv4();
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.CONVERSION_SEQUENCE_ID,
    newSequenceId
  );
};

/**
 * Generate a new session ID based on current date and UUID
 */
const generateNewSessionId = (): string => {
  // Get current date in Melbourne timezone (YYYY-MM-DD format)
  const melbourneDate = dayjs().tz(MELBOURNE_TIMEZONE).format('YYYY-MM-DD');
  return `${melbourneDate}:${uuidv4()}`;
};

/**
 * Check if we should track the page visit
 * @returns {boolean} True if should track, false if not
 */
const isTrackPageVisit = (): boolean => {
  const currentSessionId = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID);
  const lastSessionId = localStorage.getItem(
    LOCAL_STORAGE_KEYS.LAST_SESSION_ID
  );

  // If no session ID or they're different, we should track
  if (!currentSessionId || currentSessionId !== lastSessionId) {
    // Generate a new session ID if needed
    if (!currentSessionId) {
      const newSessionId = generateNewSessionId();
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION_ID, newSessionId);
    }

    // Update the last session ID
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LAST_SESSION_ID,
      localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID) || ''
    );
    return true;
  }

  return false;
};

/**
 * Track a page visit event
 * @param {string} pageUrl - The URL of the page being visited
 * @param {string} teamMemberId - Optional team member ID if viewing a specific barber page
 */
export const trackPageVisit = async (
  pageUrl: string,
  teamMemberId?: string
): Promise<void> => {
  try {
    // Check if we should track this page visit
    if (!isTrackPageVisit()) {
      console.log(`Page visit skipped (same session): ${pageUrl}`);
      return;
    }

    const sessionId = localStorage.getItem(
      LOCAL_STORAGE_KEYS.SESSION_ID
    ) as string;
    const visitorId = getUniqueVisitorId();
    const conversionSequenceId = getConversionSequenceId();
    const trafficSource = getTrafficSource();

    // Collect UTM parameters and click IDs
    const properties = {
      page_url: pageUrl,
      traffic_source: trafficSource,
      utm_source: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE) || null,
      utm_medium: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_MEDIUM) || null,
      utm_campaign:
        localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CAMPAIGN) || null,
      utm_content: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CONTENT) || null,
      fbclid: localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID) || null
    };

    // Add team member ID if available
    if (teamMemberId) {
      Object.assign(properties, { team_member_id: teamMemberId });
    }

    await axios.post(EVENTS_API_URL, {
      sessionId,
      uniqueVisitorId: visitorId,
      conversionSequenceId,
      eventName: EVENT_TYPES.PAGE_VISIT,
      properties
    });

    console.log(`Page visit tracked: ${pageUrl}`);
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
};

/**
 * Track a booking creation event
 * @param {BookingEventData} bookingData - Comprehensive booking data
 */
export const trackBookingCreated = async (
  bookingData: BookingEventData
): Promise<void> => {
  try {
    const sessionId = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID) as string;
    const visitorId = getUniqueVisitorId();
    const conversionSequenceId = getConversionSequenceId();
    const trafficSource = getTrafficSource();

    // Create nested properties structure
    const properties: BookingEventProperties = {
      booking: {
        id: bookingData.bookingId,
        amount: bookingData.amount,
        status: bookingData.status,
        startAt: bookingData.startAt,
        createdAt: bookingData.createdAt,
        customerNote: bookingData.customerNote,
        source: bookingData.source || 'Organic'
      },
      customer: {
        id: bookingData.customer.id,
        name: bookingData.customer.name,
        email: bookingData.customer.email,
        phone: bookingData.customer.phone,
        isNewCustomer: bookingData.customer.isNewCustomer
      },
      teamMember: {
        id: bookingData.teamMember.id,
        name: bookingData.teamMember.name
      },
      service: {
        name: bookingData.service.name,
        duration: bookingData.service.duration,
        price: bookingData.service.price
      },
      attribution: {
        trafficSource: trafficSource,
        utm_source: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE) || null,
        utm_medium: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_MEDIUM) || null,
        utm_campaign: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CAMPAIGN) || null,
        utm_content: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CONTENT) || null,
        fbclid: localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID) || null
      }
    };

    await axios.post(EVENTS_API_URL, {
      sessionId,
      uniqueVisitorId: visitorId,
      conversionSequenceId,
      eventName: EVENT_TYPES.CREATE_BOOKING,
      properties
    });

    // Reset conversion sequence ID after booking
    resetConversionSequenceId();

    console.log(`Booking created tracked: ${bookingData.bookingId}`);
  } catch (error) {
    console.error('Error tracking booking creation:', error);
  }
};

/**
 * Get or initialize registration start timestamp
 */
const getRegistrationStartTime = (): string => {
  let startTime = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_START_TIME);
  
  if (!startTime) {
    startTime = new Date().toISOString();
    localStorage.setItem(LOCAL_STORAGE_KEYS.REGISTRATION_START_TIME, startTime);
  }
  
  return startTime;
};

/**
 * Clear registration start timestamp
 */
const clearRegistrationStartTime = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.REGISTRATION_START_TIME);
};

/**
 * Calculate time from registration start to current time
 */
const calculateTimeFromStart = (): number => {
  const startTime = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_START_TIME);
  if (!startTime) return 0;
  
  const start = new Date(startTime);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 1000);
};

/**
 * Track need verification event (when user needs to verify their phone number)
 * @param {RegistrationUserData} userData - User registration data
 * @param {RegistrationSource} source - Registration source information
 */
export const trackNeedVerification = async (
  userData: RegistrationUserData,
  source: RegistrationSource
): Promise<void> => {
  try {
    const sessionId = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID) as string;
    const visitorId = getUniqueVisitorId();
    const conversionSequenceId = getConversionSequenceId();
    const trafficSource = getTrafficSource();
    
    // Store registration start time
    const startTime = getRegistrationStartTime();

    // Create need verification event data
    const needVerificationData: NeedVerificationEventData = {
      user: userData,
      source,
      attribution: {
        trafficSource: trafficSource,
        utm_source: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE) || null,
        utm_medium: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_MEDIUM) || null,
        utm_campaign: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CAMPAIGN) || null,
        utm_content: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CONTENT) || null,
        fbclid: localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID) || null
      },
      timestamp: startTime
    };

    await axios.post(EVENTS_API_URL, {
      sessionId,
      uniqueVisitorId: visitorId,
      conversionSequenceId,
      eventName: EVENT_TYPES.NEED_VERIFICATION,
      properties: needVerificationData
    });

    console.log(`Need verification tracked for: ${userData.email}`);
  } catch (error) {
    console.error('Error tracking need verification:', error);
  }
};

/**
 * Track registration completed event
 * @param {CompletedUserData} userData - Completed user data
 * @param {VerificationData} verificationData - Verification details
 * @param {CompletionSource} source - Completion source information
 */
export const trackRegistrationCompleted = async (
  userData: CompletedUserData,
  verificationData: VerificationData,
  source: CompletionSource
): Promise<void> => {
  try {
    const sessionId = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID) as string;
    const visitorId = getUniqueVisitorId();
    const conversionSequenceId = getConversionSequenceId();
    const trafficSource = getTrafficSource();

    // Create registration completion event data
    const completionData: RegistrationCompletedEventData = {
      user: userData,
      verification: verificationData,
      source,
      attribution: {
        trafficSource: trafficSource,
        utm_source: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE) || null,
        utm_medium: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_MEDIUM) || null,
        utm_campaign: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CAMPAIGN) || null,
        utm_content: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CONTENT) || null,
        fbclid: localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID) || null
      },
      timestamp: new Date().toISOString()
    };

    await axios.post(EVENTS_API_URL, {
      sessionId,
      uniqueVisitorId: visitorId,
      conversionSequenceId,
      eventName: EVENT_TYPES.REGISTRATION_COMPLETED,
      properties: completionData
    });

    // Clear registration start time after successful completion
    clearRegistrationStartTime();

    console.log(`Registration completed tracked for: ${userData.userId}`);
  } catch (error) {
    console.error('Error tracking registration completed:', error);
  }
};

/**
 * Track registration failed event
 * @param {string} phoneNumber - Phone number used for registration
 * @param {string} reason - Reason for failure
 * @param {number} attemptCount - Number of attempts made
 * @param {string} currentPage - Current page when failure occurred
 * @param {string} targetPage - Target page user was navigating to (if applicable)
 */
export const trackRegistrationFailed = async (
  phoneNumber: string,
  reason: 'verification_timeout' | 'user_abandoned' | 'navigation_away' | 'max_attempts_exceeded',
  attemptCount: number,
  currentPage: string,
  targetPage?: string
): Promise<void> => {
  try {
    const sessionId = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID) as string;
    const visitorId = getUniqueVisitorId();
    const conversionSequenceId = getConversionSequenceId();
    const trafficSource = getTrafficSource();
    
    // Calculate time from registration start to failure
    const timeToFailure = calculateTimeFromStart();
    
    // Determine registration path based on current flow
    const registrationPath = localStorage.getItem('booking_form_data') ? 'booking_flow' : 'direct';

    // Create registration failure event data
    const failureData: RegistrationFailedEventData = {
      user: {
        phoneNumber,
        registrationId: localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_ID) || undefined
      },
      failure: {
        reason,
        timeToFailure,
        attemptCount,
        lastAttemptAt: new Date().toISOString()
      },
      source: {
        registrationPath: registrationPath as 'direct' | 'booking_flow',
        currentPage,
        targetPage
      },
      attribution: {
        trafficSource: trafficSource,
        utm_source: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE) || null,
        utm_medium: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_MEDIUM) || null,
        utm_campaign: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CAMPAIGN) || null,
        utm_content: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CONTENT) || null,
        fbclid: localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID) || null
      },
      timestamp: new Date().toISOString()
    };

    await axios.post(EVENTS_API_URL, {
      sessionId,
      uniqueVisitorId: visitorId,
      conversionSequenceId,
      eventName: EVENT_TYPES.REGISTRATION_FAILED,
      properties: failureData
    });

    // Clear registration start time after failure
    clearRegistrationStartTime();

    console.log(`Registration failed tracked for: ${phoneNumber}, reason: ${reason}`);
  } catch (error) {
    console.error('Error tracking registration failed:', error);
  }
};

export default {
  trackPageVisit,
  trackBookingCreated,
  trackNeedVerification,
  trackRegistrationCompleted,
  trackRegistrationFailed
};
