import { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { verifyOTP, requestOTP } from '@/utils/authApi';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/react-svg/logo';
import { ChangePhoneNumberModal } from './ChangePhoneNumberModal';
import { VerificationSuccessModal } from './VerificationSuccessModal';

const otpSchema = z.object({
  otp_code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onSuccess?: () => void;
  isRegistration?: boolean; // Whether this is for registration or login
  onWrongNumber?: () => void; // Handler for when user wants to change phone number
}

export const OTPVerificationModal = ({ 
  isOpen, 
  onClose, 
  phoneNumber,
  onSuccess,
  isRegistration = false,
  onWrongNumber
}: OTPVerificationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(phoneNumber);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  const [phoneNumberChanged, setPhoneNumberChanged] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp_code: '',
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  // Update current phone number when prop changes
  useEffect(() => {
    setCurrentPhoneNumber(phoneNumber);
  }, [phoneNumber]);

  const onSubmit = async (data: OTPFormData) => {
    try {
      setIsLoading(true);
      
      // Phone number will be updated automatically by backend during verification
      
      const response = await verifyOTP(currentPhoneNumber, data.otp_code);
      
      // Store tokens and updated user info (now verified)
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      authLogin(response.accessToken, response.user);
      
      // Show success modal instead of toast
      setShowSuccessModal(true);
      form.reset();
      setPhoneNumberChanged(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid OTP code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await requestOTP(currentPhoneNumber);
      toast({
        title: 'OTP Resent',
        description: `A new OTP has been sent to ${currentPhoneNumber}`,
      });
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend OTP. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    setCurrentPhoneNumber(newPhoneNumber);
    setPhoneNumberChanged(true);
    setShowChangePhoneModal(false);
    // Reset the resend timer when phone number changes
    setResendTimer(60);
    setCanResend(false);
    // Reset the form
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    // Modal cannot be closed by user - must complete OTP or use "Wrong number?" option
    return;
  };


  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            "sm:max-w-md bg-[#010401] border border-stone-800"
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo className="w-32 h-auto opacity-90" />
          </div>
          <DialogTitle className="text-xl font-semibold text-center">Verify Your Phone</DialogTitle>
          <DialogDescription className="text-sm text-gray-400 text-center">
            We've sent a verification code to {currentPhoneNumber}
            {phoneNumberChanged && (
              <span className="block mt-1 text-xs text-amber-400">
                (Phone number updated)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            
            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      className="bg-transparent text-center text-2xl tracking-widest"
                      autoComplete="one-time-code"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the 6-digit code sent to your phone
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              {canResend ? (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResend}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Resend Code
                </Button>
              ) : (
                <p className="text-sm text-gray-400">
                  Resend code in {resendTimer}s
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#036901] hover:bg-[#025501]"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>

            {/* Wrong phone number option */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  // Always show the change phone number modal
                  setShowChangePhoneModal(true);
                }}
                className="text-sm text-gray-400 hover:text-gray-300 underline"
              >
                Wrong phone number?
              </button>
            </div>
          </form>
        </Form>
        
        {/* Close button removed - must complete OTP or use "Wrong number?" */}
      </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>

    {/* Change Phone Number Modal */}
    <ChangePhoneNumberModal
      isOpen={showChangePhoneModal}
      onClose={() => setShowChangePhoneModal(false)}
      onPhoneNumberChange={handlePhoneNumberChange}
      currentPhoneNumber={currentPhoneNumber}
    />

    {/* Verification Success Modal */}
    <VerificationSuccessModal
      isOpen={showSuccessModal}
      onClose={() => {
        setShowSuccessModal(false);
        onSuccess?.();
        onClose();
      }}
      isRegistration={isRegistration}
    />
    </>
  );
};