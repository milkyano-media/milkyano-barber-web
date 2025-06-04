import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '@/utils/eventTracker';

/**
 * Hook to track page visits throughout the application
 * 
 * @param {string} teamMemberId - Optional team member ID if viewing a specific barber page
 */
export const useEventTracking = (teamMemberId?: string) => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Only track if the path has changed since last render
    if (prevPathRef.current !== location.pathname) {
      // Track the page visit
      trackPageVisit(location.pathname + location.search, teamMemberId);
      
      // Update the previous path ref
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, location.search, teamMemberId]);
};

export default useEventTracking;