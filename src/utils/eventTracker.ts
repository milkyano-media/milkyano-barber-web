import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { EVENT_TYPES } from '@/constants/event.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKey.constants';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Initialize dayjs plugins for timezone handling
dayjs.extend(utc);
dayjs.extend(timezone);

// Base URL for the events API
const EVENTS_API_URL = `${import.meta.env.VITE_NEW_API as string}/api/v2/events`;

// Default Melbourne timezone
const MELBOURNE_TIMEZONE = 'Australia/Melbourne';

// Session lifespan in hours (from .env or default to 24 hours)
const SESSION_LIFESPAN = Number(import.meta.env.VITE_SESSION_LIFESPAN || 24);

/**
 * Determine the traffic source based on URL parameters
 */
const getTrafficSource = (): string => {
  const fbclid = localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID);
  const ttclid = localStorage.getItem(LOCAL_STORAGE_KEYS.TTCLID);
  const gclid = localStorage.getItem(LOCAL_STORAGE_KEYS.GCLID);
  const utmSource = localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE);
  
  if (fbclid) return 'FACEBOOK';
  if (ttclid) return 'TIKTOK';
  if (gclid) return 'GOOGLE';
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
  let sequenceId = localStorage.getItem(LOCAL_STORAGE_KEYS.CONVERSION_SEQUENCE_ID);
  
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
  localStorage.setItem(LOCAL_STORAGE_KEYS.CONVERSION_SEQUENCE_ID, newSequenceId);
};

/**
 * Determine if the session is valid or needs to be renewed
 */
const isValidSession = (): boolean => {
  const sessionId = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID);
  const sessionStartTime = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_START_TIME);
  
  if (!sessionId || !sessionStartTime) {
    return false;
  }
  
  // Get current time in Melbourne
  const now = dayjs().tz(MELBOURNE_TIMEZONE);
  
  // If session cutoff is daily (24 hours), check if we've passed midnight
  if (SESSION_LIFESPAN === 24) {
    const sessionDate = dayjs(sessionStartTime).tz(MELBOURNE_TIMEZONE);
    return sessionDate.format('YYYY-MM-DD') === now.format('YYYY-MM-DD');
  }
  
  // Otherwise check if we're still within the configured lifespan
  const sessionStart = dayjs(sessionStartTime);
  const hoursDifference = now.diff(sessionStart, 'hour');
  
  return hoursDifference < SESSION_LIFESPAN;
};

/**
 * Generate a new session ID and update session start time
 */
const generateNewSession = (): string => {
  const sessionId = uuidv4();
  const now = new Date().toISOString();
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION_ID, sessionId);
  localStorage.setItem(LOCAL_STORAGE_KEYS.SESSION_START_TIME, now);
  
  return sessionId;
};

/**
 * Get the current session ID or generate a new one if needed
 */
const getSessionId = (): string => {
  if (isValidSession()) {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.SESSION_ID) as string;
  }
  
  return generateNewSession();
};

/**
 * Track a page visit event
 * @param {string} pageUrl - The URL of the page being visited
 * @param {string} teamMemberId - Optional team member ID if viewing a specific barber page
 */
export const trackPageVisit = async (pageUrl: string, teamMemberId?: string): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const visitorId = getUniqueVisitorId();
    const conversionSequenceId = getConversionSequenceId();
    const trafficSource = getTrafficSource();
    
    // Collect UTM parameters and click IDs
    const properties = {
      page_url: pageUrl,
      traffic_source: trafficSource,
      utm_source: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE) || null,
      utm_medium: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_MEDIUM) || null,
      utm_campaign: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CAMPAIGN) || null,
      utm_content: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CONTENT) || null,
      fbclid: localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID) || null,
      ttclid: localStorage.getItem(LOCAL_STORAGE_KEYS.TTCLID) || null,
      gclid: localStorage.getItem(LOCAL_STORAGE_KEYS.GCLID) || null,
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
 * @param {string} bookingId - The ID of the created booking
 * @param {string} teamMemberId - The ID of the barber for the booking
 * @param {string} serviceName - The name of the booked service
 * @param {number} amount - The booking amount
 */
export const trackBookingCreated = async (
  bookingId: string,
  teamMemberId: string,
  serviceName: string,
  amount: number
): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const visitorId = getUniqueVisitorId();
    const conversionSequenceId = getConversionSequenceId();
    const trafficSource = getTrafficSource();
    
    const properties = {
      booking_id: bookingId,
      team_member_id: teamMemberId,
      service_name: serviceName,
      amount,
      traffic_source: trafficSource,
      utm_source: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_SOURCE) || null,
      utm_medium: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_MEDIUM) || null,
      utm_campaign: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CAMPAIGN) || null,
      utm_content: localStorage.getItem(LOCAL_STORAGE_KEYS.UTM_CONTENT) || null,
      fbclid: localStorage.getItem(LOCAL_STORAGE_KEYS.FBCLID) || null,
      ttclid: localStorage.getItem(LOCAL_STORAGE_KEYS.TTCLID) || null,
      gclid: localStorage.getItem(LOCAL_STORAGE_KEYS.GCLID) || null,
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
    
    console.log(`Booking created tracked: ${bookingId}`);
  } catch (error) {
    console.error('Error tracking booking creation:', error);
  }
};

export default {
  trackPageVisit,
  trackBookingCreated
};
