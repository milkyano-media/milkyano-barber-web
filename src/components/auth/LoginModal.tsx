import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { login } from "@/utils/authApi";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/react-svg/logo";
import { Eye, EyeOff } from "lucide-react";
import { OTPVerificationModal } from "./OTPVerificationModal";

const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Phone number or email is required"),
  password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  contextMessage?: string;
}

export const LoginModal = ({
  isOpen,
  onClose,
  onSuccess,
  onForgotPassword,
  contextMessage
}: LoginModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneForOTP, setPhoneForOTP] = useState("");
  const [hasShownOTP, setHasShownOTP] = useState(false);
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      // Normalize phone number formats
      let normalizedData = { ...data };
      const input = data.emailOrPhone.trim();
      
      // Handle 61 format (without +) - e.g., 61412345678
      if (/^61\d{9}$/.test(input)) {
        normalizedData.emailOrPhone = '+' + input;
      }
      // Handle 04 format - e.g., 0412345678 or 0412 345 678
      else if (/^04\d{8}$/.test(input.replace(/\s/g, ''))) {
        // Remove spaces and replace 04 with +614
        normalizedData.emailOrPhone = '+614' + input.replace(/\s/g, '').substring(2);
      }
      
      const response = await login(normalizedData);

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      authLogin(response.accessToken, response.user);
      
      // Check if user is verified
      if (!response.user.isVerified && !hasShownOTP) {
        // User is not verified, show OTP modal (closeable since they're logged in)
        setPhoneForOTP(response.user.phoneNumber);
        setShowOTPModal(true);
        setHasShownOTP(true);
        
        toast({
          title: "Welcome back!",
          description: "Please verify your phone number to unlock all features"
        });
        
        // Still close the login modal
        onClose();
        form.reset();
      } else {
        toast({
          title: "Success",
          description: "You have successfully logged in!"
        });
        
        onSuccess?.();
        onClose();
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Invalid phone number/email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
      setHasShownOTP(false);
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#010401] border border-stone-800">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo className="w-32 h-auto opacity-90" />
          </div>
          <h2 className="text-xl font-semibold text-center">Welcome Back</h2>
          {contextMessage && (
            <p className="text-sm text-amber-200 text-center bg-amber-900/20 border border-amber-600/50 rounded-md px-3 py-2">
              {contextMessage}
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number or Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your phone number or email"
                      className="bg-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Australian mobile: 04XX XXX XXX or +614XX XXX XXX
                    <br />
                    or Email: yourname@gmail.com
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-transparent pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                onClick={onForgotPassword}
                className="text-sm text-gray-400 hover:text-white p-0"
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#036901] hover:bg-[#025501]"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-[#04C600] hover:text-[#03A000] font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    // Store return URL if in booking flow
                    if (window.location.pathname.includes("/book/")) {
                      localStorage.setItem(
                        "auth_return_url",
                        window.location.pathname
                      );
                      window.location.href = `/register?redirect=${encodeURIComponent(window.location.pathname)}`;
                    } else {
                      window.location.href = "/register";
                    }
                  }}
                >
                  Create Account
                </a>
              </p>
            </div>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#010401] text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full border-stone-700 hover:bg-stone-900"
              disabled
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* OTP Verification Modal for unverified users */}
    <OTPVerificationModal
      isOpen={showOTPModal}
      onClose={() => setShowOTPModal(false)}
      phoneNumber={phoneForOTP}
      onSuccess={() => {
        setShowOTPModal(false);
        onSuccess?.();
      }}
      isRegistration={false}
      isCloseable={true}
    />
    </>
  );
};
