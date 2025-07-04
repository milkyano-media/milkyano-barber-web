import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import Layout from '@/components/web/WebLayout';
import { Helmet } from 'react-helmet-async';
import { Phone } from 'lucide-react';

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

export default function ChangePhoneNumber() {
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get parameters from URL
  const currentPhoneNumber = searchParams.get('phone') || '';
  const isRegistration = searchParams.get('registration') === 'true';
  const redirectUrl = searchParams.get('redirect') || '/';

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
      
      // Navigate back to verify OTP with new phone number
      const params = new URLSearchParams({
        phone: normalizedPhone,
        redirect: redirectUrl,
        registration: isRegistration.toString()
      });
      
      navigate(`/verify-otp?${params.toString()}`);
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

  const handleCancel = () => {
    // Navigate back to verify OTP with original phone
    const params = new URLSearchParams({
      phone: currentPhoneNumber,
      redirect: redirectUrl,
      registration: isRegistration.toString()
    });
    navigate(`/verify-otp?${params.toString()}`);
  };

  return (
    <Layout>
      <Helmet>
        <title>Change Phone Number - Fadelines Barber Shop</title>
        <meta
          name="description"
          content="Update your phone number to receive a new verification code."
        />
      </Helmet>

      <section className="min-h-screen bg-[#010401] py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 mt-4 pt-8 md:pt-0">
              Change Phone Number
            </h1>
            <p className="text-gray-400 text-sm">
              Enter a new phone number to receive your verification code
            </p>
          </div>

          <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-800/50 rounded-full mb-4">
                <Phone className="w-8 h-8 text-[#04C600]" />
              </div>
              <p className="text-sm text-gray-400">
                Current number: <span className="text-white font-medium">{currentPhoneNumber}</span>
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          className="bg-stone-950/50 border-stone-600 hover:border-stone-500 focus:border-[#04C600] transition-colors"
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
                  className="w-full bg-[#04C600] hover:bg-[#03A000] py-3 text-base font-medium text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Sending...' : 'Send OTP to New Number'}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm text-gray-400 hover:text-gray-300 underline"
                  >
                    Cancel and go back
                  </button>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Having trouble?{" "}
              <a
                href="/contact"
                className="underline hover:text-gray-300"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}