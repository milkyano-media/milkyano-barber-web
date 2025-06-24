import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { isValidPhoneNumber } from "react-phone-number-input";
import { register as registerUser } from "@/utils/authApi";
import { OTPVerificationModal } from "@/components/auth/OTPVerificationModal";
import Layout from "@/components/web/WebLayout";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Helmet } from "react-helmet-async";

const registerSchema = z
  .object({
    given_name: z.string().min(1, "First name is required"),
    family_name: z.string().min(1, "Last name is required"),
    email_address: z.string().email("Invalid email address"),
    phone_number: z
      .string()
      .refine((value) => isValidPhoneNumber(value || ""), {
        message: "Please enter a valid phone number"
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [phoneForOTP, setPhoneForOTP] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      given_name: "",
      family_name: "",
      email_address: "",
      phone_number: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Set default values from localStorage or defaults on initial mount
  useEffect(() => {
    // Try to load saved booking form data
    const savedFormData = localStorage.getItem('booking_form_data');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        form.setValue('given_name', parsedData.given_name || '');
        form.setValue('family_name', parsedData.family_name || '');
        form.setValue('email_address', parsedData.email_address || '');
        form.setValue('phone_number', parsedData.phone_number || '+61');
      } catch (error) {
        console.error('Error loading saved form data:', error);
        form.setValue("phone_number", "+61");
      }
    } else {
      form.setValue("phone_number", "+61");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await registerUser({
        phone_number: data.phone_number,
        password: data.password,
        given_name: data.given_name,
        family_name: data.family_name,
        email_address: data.email_address
      });

      if (response.requires_otp) {
        setSessionId(response.session_id);
        setPhoneForOTP(data.phone_number);
        setShowOTPModal(true);
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    toast({
      title: "Welcome!",
      description: "Your account has been created successfully."
    });

    // Clear saved booking form data after successful registration
    localStorage.removeItem('booking_form_data');

    // Check for redirect query parameter first
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      navigate(redirectParam);
    } else {
      // Fall back to localStorage
      const returnUrl = localStorage.getItem("auth_return_url");
      if (returnUrl) {
        localStorage.removeItem("auth_return_url");
        navigate(returnUrl);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Create Account - Fadelines Barber Shop</title>
        <meta
          name="description"
          content="Create an account to save time on future bookings at Fadelines Barber Shop."
        />
      </Helmet>

      <section className="min-h-screen bg-[#010401] py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 mt-4">
              Create Your Account
            </h1>
            <p className="text-gray-400 text-sm">
              Save time on future bookings and track your appointments
            </p>
          </div>

          <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-700/50 rounded-2xl p-6 shadow-2xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="given_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-stone-300">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...field}
                              placeholder="John"
                              className="pl-10 bg-stone-950/50 border-stone-600 hover:border-stone-500 focus:border-[#04C600] transition-colors"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="family_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider text-stone-300">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...field}
                              placeholder="Doe"
                              className="pl-10 bg-stone-950/50 border-stone-600 hover:border-stone-500 focus:border-[#04C600] transition-colors"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-stone-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="john.doe@example.com"
                            className="pl-10 bg-stone-950/50 border-stone-600 hover:border-stone-500 focus:border-[#04C600] transition-colors"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-stone-300">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          {...field}
                          className="bg-stone-950/50 [&_input]:border-stone-600 [&_input]:hover:border-stone-500 [&_input]:focus:border-[#04C600] [&_input]:transition-colors [&_input]:h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-stone-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 bg-stone-950/50 border-stone-600 hover:border-stone-500 focus:border-[#04C600] transition-colors"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-stone-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 bg-stone-950/50 border-stone-600 hover:border-stone-500 focus:border-[#04C600] transition-colors"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#04C600] hover:bg-[#03A000] py-3 text-base font-medium text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-6 border-t border-stone-800 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#04C600] hover:text-[#03A000] font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our{" "}
              <Link
                to="/privacy-policy"
                className="underline hover:text-gray-300"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        sessionId={sessionId}
        phoneNumber={phoneForOTP}
        onSuccess={handleOTPSuccess}
      />
    </Layout>
  );
}
