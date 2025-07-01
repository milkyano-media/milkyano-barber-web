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
import { PhoneInput } from "@/components/ui/phone-input";
import * as RPNInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { register } from "@/utils/authApi";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/react-svg/logo";
import { OTPVerificationModal } from "./OTPVerificationModal";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .refine((val) => isValidPhoneNumber(val), {
      message: "Invalid phone number"
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegisterModal = ({
  isOpen,
  onClose,
  onSuccess
}: RegisterModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registeredPhone, setRegisteredPhone] = useState("");
  const { toast } = useToast();
  const { login: authLogin } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "+61" as RPNInput.Value,
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      const response = await register({
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        password: data.password
      });

      // Store the phone number for OTP verification
      setRegisteredPhone(data.phoneNumber);
      
      toast({
        title: "Registration Successful",
        description: "Please verify your phone number to complete registration"
      });
      
      // Show OTP modal
      setShowOTPModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTPModal(false);
    onSuccess?.();
    onClose();
    form.reset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !showOTPModal) {
      onClose();
      form.reset();
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showOTPModal} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-[#010401] border border-stone-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex justify-center">
              <Logo className="w-32 h-auto opacity-90" />
            </div>
            <h2 className="text-xl font-semibold text-center">Create Account</h2>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="John"
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Doe"
                          className="bg-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john.doe@example.com"
                        className="bg-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        value={field.value as RPNInput.Value}
                        onChange={field.onChange}
                        international
                        defaultCountry="AU"
                        placeholder="Enter phone number"
                        inputClassName="bg-transparent"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="bg-transparent"
                      />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your password"
                        className="bg-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#036901] hover:bg-[#025501]"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[#04C600] hover:text-[#03A000] font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      // Navigate to login or show login modal
                      window.location.href = "/login";
                    }}
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        phoneNumber={registeredPhone}
        onSuccess={handleOTPSuccess}
        isRegistration={true}
      />
    </>
  );
};