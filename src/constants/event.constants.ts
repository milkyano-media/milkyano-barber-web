// Event types for analytics tracking
export const EVENT_TYPES = {
  PAGE_VISIT: 'page_visit',
  CREATE_BOOKING: 'create_booking',
  NEED_VERIFICATION: 'need_verification',
  REGISTRATION_COMPLETED: 'registration_completed',
  REGISTRATION_FAILED: 'registration_failed'
};

// Traffic source types
export const TRAFFIC_SOURCE_TYPES = {
  DIRECT: 'DIRECT',
  ORGANIC: 'ORGANIC',
  FACEBOOK: 'FACEBOOK',
  TIKTOK: 'TIKTOK',
  GOOGLE: 'GOOGLE',
  OTHER: 'OTHER'
};

// Environment variables
export const SESSION_CONFIG = {
  // Default session duration in hours (will be overridden by .env)
  DEFAULT_LIFESPAN: 24,
  // Default timezone for session cutoffs
  DEFAULT_TIMEZONE: 'Australia/Melbourne'
};
