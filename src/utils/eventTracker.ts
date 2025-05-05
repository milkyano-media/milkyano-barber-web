import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { EVENT_TYPES } from '@/constants/event.constants';
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKey.constants';
import { BookingEventData, BookingEventProperties } from '@/interfaces/EventInterface';
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
        phone: bookingData.customer.phone
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

export default {
  trackPageVisit,
  trackBookingCreated
};
