import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { trackNeedVerification, trackRegistrationFailed } from '@/utils/eventTracker';

interface GooglePhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  } | null;
  idToken: string;
  onSuccess?: () => void;
}

const GooglePhoneNumberModal: React.FC<GooglePhoneNumberModalProps> = ({
  isOpen,
  onClose,
  profile,
  idToken,
  onSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { completeGoogleAuth } = useAuth();
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
            page: '/oauth-phone-modal',
            referrer: document.referrer,
            registrationTrigger: localStorage.getItem('booking_form_data') ? 'booking_flow' : 'header_cta'
          }
        );
      }
      
      // Complete Google OAuth registration with phone number
      const response = await completeGoogleAuth(idToken, phoneNumber);
      
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
      console.error('Google OAuth completion error:', error);
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
          '/oauth-phone-modal'
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
          {/* Google Profile Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
            {profile.picture && (
              <img 
                src={profile.picture} 
                alt={profile.firstName}
                className="w-10 h-10 rounded-full"
              />
            )}
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
                      '/oauth-phone-modal'
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

export default GooglePhoneNumberModal;