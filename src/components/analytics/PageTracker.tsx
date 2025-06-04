import React from 'react';
import useEventTracking from '@/hooks/useEventTracking';
import useUtmTracking from '@/hooks/utmTrackingHook';

/**
 * Component that handles page tracking throughout the application
 * This should be placed at the top level of the app, e.g., in App.tsx
 */
const PageTracker: React.FC = () => {
  // First track UTM parameters
  useUtmTracking();
  
  // Then track page views
  useEventTracking();
  
  // This component doesn't render anything
  return null;
};

export default PageTracker;