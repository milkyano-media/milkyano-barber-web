import React, { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface GoogleOAuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onNeedPhoneNumber?: (profile: any, idToken: string) => void;
}

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  onSuccess,
  onError,
  onNeedPhoneNumber
}) => {
  const { verifyGoogleAuth, loginWithExistingGoogleUser } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeGoogleAuth();
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleAuth = useCallback(() => {
    if (isInitialized.current || !window.google) return;
    
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      onError?.('Google authentication is not configured. Please contact support.');
      return;
    }

    try {
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            console.log('Google OAuth response:', response);
            
            const idToken = response.credential;
            if (!idToken) {
              onError?.('No credential received from Google');
              return;
            }

            // Send the ID token to our backend for verification
            const result = await verifyGoogleAuth(idToken);
            
            if (result.type === 'new_user') {
              // New user - needs phone number
              onNeedPhoneNumber?.(result.profile, idToken);
            } else if (result.type === 'existing_user') {
              // Existing user - login successful
              await loginWithExistingGoogleUser(result);
              onSuccess?.();
            }
            
          } catch (error: any) {
            console.error('Google OAuth verification failed:', error);
            onError?.(error.response?.data?.error || 'Google authentication failed');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        locale: 'en'
      });

      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // On mobile, render a centered modal button
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '50%';
        buttonContainer.style.left = '50%';
        buttonContainer.style.transform = 'translate(-50%, -50%)';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.backgroundColor = 'white';
        buttonContainer.style.padding = '20px';
        buttonContainer.style.borderRadius = '8px';
        buttonContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        buttonContainer.style.minWidth = '300px';
        
        document.body.appendChild(buttonContainer);
        
        (window.google.accounts.id as any).renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'continue_with',
          shape: 'rectangular',
          width: '100%',
          locale: 'en'
        });
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '10px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
          if (document.body.contains(buttonContainer)) {
            document.body.removeChild(buttonContainer);
          }
        };
        
        buttonContainer.appendChild(closeButton);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
          if (document.body.contains(buttonContainer)) {
            document.body.removeChild(buttonContainer);
          }
        }, 60000);
      } else {
        // On desktop, use One Tap and render fallback button
        if (googleButtonRef.current) {
          (window.google.accounts.id as any).renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'rectangular',
            width: '100%',
            locale: 'en'
          });
        }
        
        // Try One Tap prompt for desktop
        try {
          window.google.accounts.id.prompt();
        } catch (error) {
          console.log('Google One Tap prompt failed, user can click the button');
        }
      }

      isInitialized.current = true;
      
    } catch (error) {
      console.error('Google OAuth initialization error:', error);
      onError?.('Failed to initialize Google authentication');
    }
  }, [verifyGoogleAuth, loginWithExistingGoogleUser, onSuccess, onError, onNeedPhoneNumber]);


  return (
    <div className="w-full">
      {/* Desktop: Google button renders here, Mobile: trigger button */}
      <div className="w-full flex justify-center">
        <div ref={googleButtonRef} className="w-full flex justify-center items-center max-w-xs" />
        
        {/* Fallback/trigger button if Google button doesn't render */}
        {/* {!isInitialized.current && (
          <Button
            variant="outline"
            onClick={initializeGoogleAuth}
            disabled={disabled}
            className="w-full max-w-xs flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {children || 'Continue with Google'}
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default GoogleOAuthButton;