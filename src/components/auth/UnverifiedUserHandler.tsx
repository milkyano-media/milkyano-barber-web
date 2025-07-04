import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Global component that monitors auth state and redirects to OTP verification
 * for authenticated but unverified users
 */
export const UnverifiedUserHandler = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated but not verified
    if (isAuthenticated && user && !user.isVerified) {
      // Don't redirect if already on the verify-otp page
      if (location.pathname !== '/verify-otp') {
        const redirectUrl = location.pathname || '/';
        navigate(`/verify-otp?phone=${encodeURIComponent(user.phoneNumber)}&redirect=${encodeURIComponent(redirectUrl)}`);
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  // This component doesn't render anything
  return null;
};