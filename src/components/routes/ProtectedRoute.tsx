import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/auth/LoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component - shows login modal for unauthenticated users
 * Used for pages that require authentication like account, bookings, etc.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, isLoading]);

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // If not authenticated, show login modal
  if (!isAuthenticated) {
    return (
      <>
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            // Navigate back to home when modal is closed
            navigate('/');
          }}
          onForgotPassword={() => {
            setShowLoginModal(false);
            navigate('/forgot-password');
          }}
          contextMessage="Please sign in to access this page"
        />
        {/* Show a loading state or empty page while modal is open */}
        <div className="min-h-screen bg-black" />
      </>
    );
  }

  // If authenticated, render the children
  return <>{children}</>;
};