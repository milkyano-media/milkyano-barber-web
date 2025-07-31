import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { trackNeedVerification, trackRegistrationFailed } from '@/utils/eventTracker';

interface ApplePhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  idToken: string;
  onSuccess?: () => void;
}

const ApplePhoneNumberModal: React.FC<ApplePhoneNumberModalProps> = ({
  isOpen,
  onClose,
  profile,
  idToken,
  onSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { completeAppleAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Track need verification event for OAuth registration
      if (profile) {
        await trackNeedVerification(
          {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phoneNumber: phoneNumber
          },
          {
            page: '/apple-oauth-phone-modal',
            referrer: document.referrer,
            registrationTrigger: localStorage.getItem('booking_form_data') ? 'booking_flow' : 'header_cta'
          }
        );
      }
      
      // Complete Apple OAuth registration with phone number
      await completeAppleAuth(idToken, phoneNumber);
      
      toast({
        title: "Success",
        description: "Account created successfully! Please verify your phone number."
      });
      
      // Close modal
      onClose();
      onSuccess?.();
      
      // Navigate to OTP verification page with registration flag
      navigate(`/verify-otp?phone=${encodeURIComponent(phoneNumber)}&redirect=${encodeURIComponent(window.location.pathname)}&registration=true`);
      
    } catch (error: any) {
      console.error('Apple OAuth completion error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to complete registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Track registration failed if user closes modal without completing
      if (phoneNumber && profile) {
        trackRegistrationFailed(
          phoneNumber,
          'user_abandoned',
          0,
          '/apple-oauth-phone-modal'
        );
      }
      onClose();
    }
  };

  // Don't render if profile is null
  if (!profile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#010401] border border-stone-800">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Complete Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Apple Profile Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09999 22C7.78999 22.05 6.79999 20.68 5.95999 19.47C4.24999 17 2.93999 12.45 4.69999 9.39C5.56999 7.87 7.13999 6.91 8.81999 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">{profile.firstName} {profile.lastName}</p>
              <p className="text-sm text-gray-400">{profile.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 text-center">
            We need your phone number to complete your account setup and send booking confirmations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-transparent"
                autoFocus
              />
              <div className="text-xs text-gray-500 mt-1">
                Australian mobile: 04XX XXX XXX or +614XX XXX XXX
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Track registration failed if user cancels
                  if (phoneNumber && profile) {
                    trackRegistrationFailed(
                      phoneNumber,
                      'user_abandoned',
                      0,
                      '/apple-oauth-phone-modal'
                    );
                  }
                  onClose();
                }}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#036901] hover:bg-[#025501]"
              >
                {isLoading ? "Creating Account..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplePhoneNumberModal;