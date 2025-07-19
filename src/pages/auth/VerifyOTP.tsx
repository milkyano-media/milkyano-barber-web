import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { verifyOTP, requestOTP } from "@/utils/authApi";
import { useAuth } from "@/hooks/useAuth";
import { trackRegistrationCompleted, trackRegistrationFailed } from "@/utils/eventTracker";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKey.constants";
import { useRegistrationTracking } from "@/hooks/useRegistrationTracking";
import Layout from "@/components/web/WebLayout";
import { CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Logo from "@/components/react-svg/logo";

const otpSchema = z.object({
  otp_code: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers")
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function VerifyOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { login: authLogin, user, isAuthenticated } = useAuth();
  
  // Get phone number and redirect URL from query params
  const phoneNumber = searchParams.get("phone") || "";
  const redirectUrl = searchParams.get("redirect") || "/";
  const isRegistration = searchParams.get("registration") === "true";
  const isForgotPassword = searchParams.get("context") === "forgot-password";

  // Use registration tracking hook
  useRegistrationTracking({
    phoneNumber,
    attemptCount: otpAttempts,
    isRegistration,
    currentPage: '/verify-otp',
    isCompleted: showSuccess
  });

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp_code: ""
    }
  });

  // Check if user is already verified (skip this check for forgot password)
  useEffect(() => {
    if (!isForgotPassword && isAuthenticated && user?.isVerified) {
      setIsAlreadyVerified(true);
      toast({
        title: "Already Verified",
        description: "Your phone number is already verified.",
      });
      
      // Redirect after 2 seconds
      const timer = setTimeout(() => {
        navigate(redirectUrl);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, navigate, redirectUrl, toast, isForgotPassword]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (resendTimer > 0 && !canResend) {
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
  }, [resendTimer, canResend]);

  // Auto-redirect after success
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate(redirectUrl);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate, redirectUrl]);

  // Track registration failed when user leaves verification page during registration
  useEffect(() => {
    if (!isRegistration) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only track if they haven't successfully completed verification
      if (!showSuccess) {
        trackRegistrationFailed(
          phoneNumber,
          'user_abandoned',
          otpAttempts,
          '/verify-otp'
        );
      }
    };

    const handlePopState = () => {
      // Only track if they haven't successfully completed verification
      if (!showSuccess) {
        trackRegistrationFailed(
          phoneNumber,
          'navigation_away',
          otpAttempts,
          '/verify-otp',
          'back_navigation'
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isRegistration, phoneNumber, otpAttempts, showSuccess]);

  const calculateTimeToVerify = (): number => {
    const startTime = localStorage.getItem(LOCAL_STORAGE_KEYS.REGISTRATION_START_TIME);
    if (!startTime) return 0;
    
    const start = new Date(startTime);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / 1000);
  };

  const onSubmit = async (data: OTPFormData) => {
    // Check if user is already verified (skip for forgot password)
    if (!isForgotPassword && isAuthenticated && user?.isVerified) {
      toast({
        title: "Already Verified",
        description: "Your phone number is already verified.",
      });
      navigate(redirectUrl);
      return;
    }
    
    try {
      setIsLoading(true);
      setOtpAttempts(prev => prev + 1);
      
      const response = await verifyOTP(phoneNumber, data.otp_code);
      
      // Always store tokens and login after successful OTP verification
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      authLogin(response.accessToken, response.user);
      
      // Track registration completed if this is a registration flow
      if (isRegistration) {
        await trackRegistrationCompleted(
          {
            userId: response.user.id,
            phoneNumber: response.user.phoneNumber,
            isNewCustomer: true
          },
          {
            method: 'otp',
            attemptCount: otpAttempts + 1,
            timeToVerify: calculateTimeToVerify()
          },
          {
            registrationPath: localStorage.getItem('booking_form_data') ? 'booking_flow' : 'direct',
            redirectTo: redirectUrl
          }
        );
      }
      
      // Show success state
      setShowSuccess(true);
      
      // Different toast messages based on context
      if (isForgotPassword) {
        toast({
          title: "Verified!",
          description: "Phone number verified. You can now reset your password."
        });
      } else if (isRegistration) {
        toast({
          title: "Success!",
          description: "Your account has been created and verified."
        });
      } else {
        toast({
          title: "Success!",
          description: "Your phone number has been verified."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Invalid OTP code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await requestOTP(phoneNumber);
      toast({
        title: "OTP Resent",
        description: `A new code has been sent to ${phoneNumber}`
      });
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleWrongNumber = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Track registration failed if user changes phone number during registration
    // Only track if they haven't successfully completed verification
    if (isRegistration && !showSuccess) {
      trackRegistrationFailed(
        phoneNumber,
        'navigation_away',
        otpAttempts,
        '/verify-otp',
        '/change-phone-number'
      );
    }
    
    // Navigate to change phone number page
    const params = new URLSearchParams({
      phone: phoneNumber,
      redirect: redirectUrl,
      registration: isRegistration.toString()
    });
    
    if (isForgotPassword) {
      params.append('context', 'forgot-password');
    }
    
    navigate(`/change-phone-number?${params.toString()}`);
  };

  if (showSuccess || isAlreadyVerified) {
    return (
      <Layout>
        <Helmet>
          <title>
            {isAlreadyVerified ? "Already Verified" : "Verification Successful"} - Fadelines Barber Shop
          </title>
        </Helmet>
        
        <section className="min-h-screen bg-[#010401] py-12 md:py-20 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-lg">
            <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-700/50 rounded-2xl p-8 shadow-2xl text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">
                {isAlreadyVerified ? "Already Verified!" : isForgotPassword ? "Phone Verified!" : "Account Verified!"}
              </h1>
              
              <p className="text-gray-400 mb-6">
                {isAlreadyVerified
                  ? "Your phone number is already verified. No need to verify again."
                  : isForgotPassword
                  ? "Your phone number has been verified. You can now reset your password."
                  : isRegistration 
                  ? "Your account has been successfully created and verified. Welcome to Faded Lines!"
                  : "Your phone number has been verified successfully."
                }
              </p>
              
              <p className="text-sm text-gray-500">
                Redirecting you in a moment...
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Verify Your Phone - Fadelines Barber Shop</title>
        <meta
          name="description"
          content="Enter the verification code sent to your phone to complete your account setup."
        />
      </Helmet>

      <section className="min-h-screen bg-[#010401] py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Logo className="w-32 h-auto opacity-90" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isForgotPassword ? "Reset Password" : "Verify Your Phone"}
            </h1>
            <p className="text-gray-400 text-sm">
              We've sent a verification code to {phoneNumber}
            </p>
          </div>

          <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-700/50 rounded-2xl p-6 shadow-2xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="otp_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-stone-300">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="000000"
                          className="bg-stone-950/50 border-stone-600 hover:border-stone-500 focus:border-[#04C600] transition-colors text-center text-2xl tracking-widest"
                          autoComplete="one-time-code"
                          autoFocus
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
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
                  className="w-full bg-[#04C600] hover:bg-[#03A000] py-3 text-base font-medium text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={(e) => handleWrongNumber(e)}
                    className="text-sm text-gray-400 hover:text-gray-300 underline"
                  >
                    Wrong phone number?
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