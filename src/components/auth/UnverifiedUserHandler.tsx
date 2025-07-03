import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { OTPVerificationModal } from './OTPVerificationModal';

/**
 * Global component that monitors auth state and shows OTP verification modal
 * for authenticated but unverified users
 */
export const UnverifiedUserHandler = () => {
  const { user, isAuthenticated } = useAuth();
  const [showOTPModal, setShowOTPModal] = useState(false);

  useEffect(() => {
    // Check if user is authenticated but not verified
    if (isAuthenticated && user && !user.isVerified) {
      setShowOTPModal(true);
    } else {
      setShowOTPModal(false);
    }
  }, [isAuthenticated, user]);

  // Don't render anything if user is verified or not authenticated
  if (!isAuthenticated || !user || user.isVerified) {
    return null;
  }

  return (
    <OTPVerificationModal
      isOpen={showOTPModal}
      onClose={() => {
        // Modal cannot be closed - user must verify
      }}
      phoneNumber={user.phoneNumber}
      onSuccess={() => {
        // On success, the user will be updated with isVerified: true
        // which will automatically hide this modal
        setShowOTPModal(false);
      }}
      isRegistration={false}
    />
  );
};