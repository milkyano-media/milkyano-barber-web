import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
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
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/utils/authApi';
import { useToast } from '@/components/ui/use-toast';
import Logo from '@/components/react-svg/logo';
import { isValidPhoneNumber } from 'react-phone-number-input';

const loginSchema = z.object({
  phone_number: z.string().refine(
    (value) => isValidPhoneNumber(value || ''),
    { message: 'Please enter a valid phone number' }
  ),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export const LoginModal = ({ isOpen, onClose, onSuccess, onForgotPassword }: LoginModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone_number: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await login(data);
      
      if (response.success) {
        authLogin(response.token, response.customer);
        toast({
          title: 'Success',
          description: 'You have successfully logged in!',
        });
        onSuccess?.();
        onClose();
        form.reset();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid phone number or password',
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
      <DialogContent className="sm:max-w-md bg-[#010401] border border-stone-800">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo className="w-32 h-auto opacity-90" />
          </div>
          <h2 className="text-xl font-semibold text-center">Welcome Back</h2>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      defaultCountry="AU"
                      placeholder="Enter phone number"
                      className="bg-transparent"
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
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-[#04C600] hover:text-[#03A000] font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    // Store return URL if in booking flow
                    if (window.location.pathname.includes('/book/')) {
                      localStorage.setItem('auth_return_url', window.location.pathname);
                    }
                    window.location.href = '/register';
                  }}
                >
                  Create Account
                </a>
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};