import { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
import { requestOTP } from '@/utils/authApi';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/react-svg/logo';

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface ChangePhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhoneNumberChange: (phoneNumber: string) => void;
  currentPhoneNumber: string;
}

export const ChangePhoneNumberModal = ({ 
  isOpen, 
  onClose, 
  onPhoneNumberChange,
  currentPhoneNumber
}: ChangePhoneNumberModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);
  const { toast } = useToast();

  const form = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  const normalizePhoneNumber = (input: string): string => {
    const trimmed = input.trim();
    
    // Handle 61 format (without +) - e.g., 61412345678
    if (/^61\d{9}$/.test(trimmed)) {
      return '+' + trimmed;
    }
    // Handle 04 format - e.g., 0412345678 or 0412 345 678
    else if (/^04\d{8}$/.test(trimmed.replace(/\s/g, ''))) {
      // Remove spaces and replace 04 with +614
      return '+614' + trimmed.replace(/\s/g, '').substring(2);
    }
    // Return as-is if already has + or other format
    return trimmed;
  };

  const onSubmit = async (data: PhoneFormData) => {
    try {
      setIsLoading(true);
      
      const normalizedPhone = normalizePhoneNumber(data.phoneNumber);
      
      // Check if it's the same number
      if (normalizedPhone === currentPhoneNumber) {
        toast({
          title: 'Same Phone Number',
          description: 'Please enter a different phone number',
          variant: 'destructive',
        });
        return;
      }
      
      // Request OTP for the new number
      await requestOTP(normalizedPhone);
      
      toast({
        title: 'OTP Sent',
        description: `A new verification code has been sent to ${normalizedPhone}`,
      });
      
      // Set timer for resend
      setResendTimer(60);
      setCanSubmit(false);
      
      // Pass the new phone number back
      onPhoneNumberChange(normalizedPhone);
      
      // Close this modal
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            "sm:max-w-md bg-[#010401] border border-stone-800"
          )}>
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo className="w-32 h-auto opacity-90" />
          </div>
          <DialogTitle className="text-xl font-semibold text-center">Change Phone Number</DialogTitle>
          <DialogDescription className="text-sm text-gray-400 text-center">
            Enter a new phone number to receive your verification code
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your phone number"
                      className="bg-transparent"
                      autoFocus
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Australian mobile: 04XX XXX XXX or +614XX XXX XXX
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {resendTimer > 0 && (
              <p className="text-sm text-gray-400 text-center">
                Please wait {resendTimer}s before sending another OTP
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !canSubmit}
              className="w-full bg-[#036901] hover:bg-[#025501]"
            >
              {isLoading ? 'Sending...' : 'Resend OTP with this number'}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  form.reset();
                }}
                className="text-sm text-gray-400 hover:text-gray-300 underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </Form>
      </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};