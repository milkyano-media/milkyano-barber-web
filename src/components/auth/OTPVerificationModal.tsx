import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
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
import { verifyRegistration } from '@/utils/authApi';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/react-svg/logo';

const otpSchema = z.object({
  otp_code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  phoneNumber: string;
  onSuccess?: () => void;
  mockOTP?: string; // Mock OTP for development testing
}

export const OTPVerificationModal = ({ 
  isOpen, 
  onClose, 
  sessionId, 
  phoneNumber,
  onSuccess,
  mockOTP 
}: OTPVerificationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
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

  const onSubmit = async (data: OTPFormData) => {
    try {
      setIsLoading(true);
      const response = await verifyRegistration({
        session_id: sessionId,
        otp_code: data.otp_code,
      });
      
      if (response.success) {
        authLogin(response.token, response.customer);
        toast({
          title: 'Success',
          description: 'Your account has been created successfully!',
        });
        onSuccess?.();
        onClose();
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Invalid OTP code',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to verify OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    // In a real implementation, this would call an API to resend OTP
    toast({
      title: 'OTP Resent',
      description: 'A new OTP has been sent to your phone',
    });
    setResendTimer(60);
    setCanResend(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#010401] border border-stone-800">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo className="w-32 h-auto opacity-90" />
          </div>
          <h2 className="text-xl font-semibold text-center">Verify Your Phone</h2>
          <p className="text-sm text-gray-400 text-center">
            We've sent a verification code to {phoneNumber}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Mock OTP display for testing */}
            {mockOTP && (
              <div className="bg-amber-900/20 border border-amber-600/50 rounded-md p-4 mb-4">
                <p className="text-amber-200 text-sm font-medium mb-1">
                  🧪 TEST MODE - Your OTP Code:
                </p>
                <p className="text-amber-100 text-2xl font-mono tracking-wider text-center">
                  {mockOTP}
                </p>
                <p className="text-amber-200/70 text-xs mt-2 text-center">
                  This is only visible in test mode
                </p>
              </div>
            )}
            
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};