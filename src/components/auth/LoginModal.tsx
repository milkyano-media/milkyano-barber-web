import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import GoogleOAuthButton from "./GoogleOAuthButton";
import GooglePhoneNumberModal from "./GooglePhoneNumberModal";

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
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleProfile, setGoogleProfile] = useState<any>(null);
  const [googleIdToken, setGoogleIdToken] = useState<string>('');
  const { login: authLogin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const input = data.emailOrPhone.trim();
      let normalizedEmailOrPhone = data.emailOrPhone;
      
      // Handle 61 format (without +) - e.g., 61412345678
      if (/^61\d{9}$/.test(input)) {
        normalizedEmailOrPhone = '+' + input;
      }
      // Handle 04 format - e.g., 0412345678 or 0412 345 678
      else if (/^04\d{8}$/.test(input.replace(/\s/g, ''))) {
        // Remove spaces and replace 04 with +614
        normalizedEmailOrPhone = '+614' + input.replace(/\s/g, '').substring(2);
      }
      
      const response = await login({
        ...data,
        emailOrPhone: normalizedEmailOrPhone
      });

      // Store tokens and user info
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      authLogin(response.accessToken, response.user);
      
      // Check if user is verified
      if (!response.user.isVerified) {
        // User is not verified, redirect to OTP verification page
        const redirectUrl = window.location.pathname.includes("/book/") 
          ? window.location.pathname 
          : "/";
        
        toast({
          title: "Welcome back!",
          description: "Please verify your phone number to unlock all features"
        });
        
        // Close the login modal
        onClose();
        form.reset();
        
        // Navigate to OTP verification page
        navigate(`/verify-otp?phone=${encodeURIComponent(response.user.phoneNumber)}&redirect=${encodeURIComponent(redirectUrl)}`);
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
    }
  };

  return (
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

        {/* Google OAuth Button - Outside of form */}
        <div className="mb-4">
          <GoogleOAuthButton
            onSuccess={() => {
              toast({
                title: "Success",
                description: "You have successfully logged in with Google!"
              });
              onSuccess?.();
              onClose();
              form.reset();
            }}
            onError={(error) => {
              toast({
                title: "Error",
                description: error,
                variant: "destructive"
              });
            }}
            onNeedPhoneNumber={(profile, idToken) => {
              setGoogleProfile(profile);
              setGoogleIdToken(idToken);
              setShowPhoneModal(true);
            }}
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#010401] px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

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
      </DialogContent>
      
      {/* Google Phone Number Modal */}
      <GooglePhoneNumberModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        profile={googleProfile}
        idToken={googleIdToken}
        onSuccess={() => {
          setShowPhoneModal(false);
          onSuccess?.();
          onClose();
          form.reset();
        }}
      />
    </Dialog>
  );
};
