import React, { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

interface GoogleOAuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onNeedPhoneNumber?: (profile: any, idToken: string) => void;
}

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  onSuccess,
  onError,
  onNeedPhoneNumber,
}) => {
  const { verifyGoogleAuth, loginWithExistingGoogleUser } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
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
      onError?.(
        "Google authentication is not configured. Please contact support."
      );
      return;
    }

    try {
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            console.log("Google OAuth response:", response);

            const idToken = response.credential;
            if (!idToken) {
              onError?.("No credential received from Google");
              return;
            }

            // Send the ID token to our backend for verification
            const result = await verifyGoogleAuth(idToken);

            if (result.type === "new_user") {
              // New user - needs phone number
              onNeedPhoneNumber?.(result.profile, idToken);
            } else if (result.type === "existing_user") {
              // Existing user - login successful
              await loginWithExistingGoogleUser(result);
              onSuccess?.();
            }
          } catch (error: any) {
            console.error("Google OAuth verification failed:", error);
            onError?.(
              error.response?.data?.error || "Google authentication failed"
            );
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        locale: "en",
      });

      // Check if we're on mobile
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isMobile) {
        // On mobile, render a centered modal button
        const buttonContainer = document.createElement("div");
        buttonContainer.style.position = "fixed";
        buttonContainer.style.top = "50%";
        buttonContainer.style.left = "50%";
        buttonContainer.style.transform = "translate(-50%, -50%)";
        buttonContainer.style.zIndex = "9999";
        buttonContainer.style.backgroundColor = "white";
        buttonContainer.style.padding = "20px";
        buttonContainer.style.borderRadius = "8px";
        buttonContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        buttonContainer.style.minWidth = "300px";

        document.body.appendChild(buttonContainer);

        (window.google.accounts.id as any).renderButton(buttonContainer, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "continue_with",
          shape: "rectangular",
          width: 400,
          locale: "en",
        });

        // Apply minimal styling - just ensure consistent height
        setTimeout(() => {
          const googleBtn = buttonContainer.querySelector('div[role="button"]') as HTMLElement;
          if (googleBtn) {
            // Only set height, let Google handle its own width
            googleBtn.style.height = "40px";
            googleBtn.style.minHeight = "40px";
            googleBtn.style.maxHeight = "40px";
          }
        }, 100);

        // Add close button
        const closeButton = document.createElement("button");
        closeButton.innerHTML = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "10px";
        closeButton.style.border = "none";
        closeButton.style.background = "none";
        closeButton.style.fontSize = "20px";
        closeButton.style.cursor = "pointer";
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
          (window.google.accounts.id as any).renderButton(
            googleButtonRef.current,
            {
              theme: "outline",
              size: "large",
              type: "standard",
              text: "continue_with",
              shape: "rectangular",
              width: googleButtonRef.current.offsetWidth || 300,
              locale: "en",
            }
          );

          // Apply minimal styling - just ensure consistent height
          setTimeout(() => {
            const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
            if (googleBtn) {
              // Only set height, let Google handle its own width
              googleBtn.style.height = "40px";
              googleBtn.style.minHeight = "40px";
              googleBtn.style.maxHeight = "40px";
            }
          }, 100);
        }

        // Try One Tap prompt for desktop
        try {
          window.google.accounts.id.prompt();
        } catch (error) {
          console.log(
            "Google One Tap prompt failed, user can click the button"
          );
        }
      }

      isInitialized.current = true;
    } catch (error) {
      console.error("Google OAuth initialization error:", error);
      onError?.("Failed to initialize Google authentication");
    }
  }, [
    verifyGoogleAuth,
    loginWithExistingGoogleUser,
    onSuccess,
    onError,
    onNeedPhoneNumber,
  ]);

  return (
    <div className="google-oauth-container">
      {/* Desktop: Google button renders here, Mobile: trigger button */}
      <div className="flex justify-center">
        <div
          ref={googleButtonRef}
          className="flex justify-center items-center"
          style={{ minHeight: "40px" }}
        />
      </div>
    </div>
  );
};

export default GoogleOAuthButton;
