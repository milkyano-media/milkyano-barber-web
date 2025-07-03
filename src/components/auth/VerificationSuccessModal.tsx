import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import Logo from '@/components/react-svg/logo';
import { CheckCircle } from 'lucide-react';

interface VerificationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRegistration?: boolean;
}

export const VerificationSuccessModal = ({ 
  isOpen, 
  onClose,
  isRegistration = false
}: VerificationSuccessModalProps) => {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <DialogTitle className="text-xl font-semibold text-center">
            Account Verified!
          </DialogTitle>
          
          <DialogDescription className="text-sm text-gray-400 text-center">
            {isRegistration 
              ? "Your account has been successfully created and verified. Welcome to Faded Lines!"
              : "Your phone number has been verified successfully. You now have access to all features."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-[#036901] hover:bg-[#025501]"
          >
            Continue
          </Button>
        </div>
      </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};