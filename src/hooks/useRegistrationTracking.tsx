import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackRegistrationFailed } from '@/utils/eventTracker';
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKey.constants';

interface UseRegistrationTrackingProps {
  phoneNumber: string;
  attemptCount: number;
  isRegistration: boolean;
  currentPage: string;
  isCompleted?: boolean;
}

/**
 * Hook to track registration failures when user navigates away from verification process
 */
export const useRegistrationTracking = ({
  phoneNumber,
  attemptCount,
  isRegistration,
  currentPage,
  isCompleted = false
}: UseRegistrationTrackingProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isRegistration || isCompleted) return;

    // Track navigation away from verification process
    const handleRouteChange = () => {
      // Only track if we're leaving the verification flow and haven't completed
      if (location.pathname !== '/verify-otp' && location.pathname !== '/change-phone-number' && !isCompleted) {
        trackRegistrationFailed(
          phoneNumber,
          'navigation_away',
          attemptCount,
          currentPage,
          location.pathname
        );
      }
    };

    // Track when user manually navigates to different pages
    const currentPath = location.pathname;
    return () => {
      if (currentPath !== location.pathname && !isCompleted) {
        handleRouteChange();
      }
    };
  }, [location.pathname, isRegistration, phoneNumber, attemptCount, currentPage, isCompleted]);

  // Track timeout scenarios
  useEffect(() => {
    if (!isRegistration || isCompleted) return;

    const startTime = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_START_TIME);
    if (!startTime) return;

    // Set a timeout for 15 minutes (900 seconds) - reasonable registration timeout
    const timeoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
    const start = new Date(startTime).getTime();
    const elapsed = Date.now() - start;
    const remaining = timeoutDuration - elapsed;

    if (remaining > 0) {
      const timeoutId = setTimeout(() => {
        // Only track timeout if not completed
        if (!isCompleted) {
          trackRegistrationFailed(
            phoneNumber,
            'verification_timeout',
            attemptCount,
            currentPage
          );
        }
      }, remaining);

      return () => clearTimeout(timeoutId);
    }
  }, [isRegistration, phoneNumber, attemptCount, currentPage, isCompleted]);
};

export default useRegistrationTracking;