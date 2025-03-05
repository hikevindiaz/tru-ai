import { CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { Button } from "@/components/Button";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string;
}

export function SuccessDialog({ open, onOpenChange, threadId }: SuccessDialogProps) {
  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
          <DialogTitle className="font-semibold text-gray-900 dark:text-gray-50 text-xl">
            Conversation Deleted
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Your conversation has been successfully deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex justify-center">
          <Button
            variant="primary"
            onClick={() => {
              onOpenChange(false);
              // Trigger a refresh of the conversations list and select next thread
              const event = new CustomEvent('inboxThreadDeleted', { 
                detail: { 
                  threadId: threadId,
                  selectNext: true 
                } 
              });
              window.dispatchEvent(event);
            }}
            className="w-full sm:w-32"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 