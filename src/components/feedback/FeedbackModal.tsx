import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSubmitFeedbackMutation } from "@/store/api/feedbackApi";
import { useCancelSubscriptionMutation } from "@/store/api/subscriptionApi";
import { useGetCurrentUserQuery } from "@/store/api/authApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const feedbackSchema = z.object({
  isSatisfied: z.boolean(),
  message: z
    .string()
    .min(10, "Feedback message must be at least 10 characters long")
    .max(1000, "Feedback message cannot exceed 1000 characters")
    .trim(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface GenericFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  // Modal content customization
  title: string;
  satisfactionQuestion: string;
  textareaLabel: string;
  textareaPlaceholder: string;
  submitButtonText: string;
  successMessage: string;
  // Radio button options
  positiveOption: string;
  negativeOption: string;
  // Button styling
  submitButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  // API and mutation
  mutation: any;
  showUpgradeButton?: boolean;
  // Additional API for subscription cancellation
  shouldCancelSubscription?: boolean;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

// Generic reusable modal component
export const GenericFeedbackModal: React.FC<GenericFeedbackModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  title,
  satisfactionQuestion,
  textareaLabel,
  textareaPlaceholder,
  submitButtonText,
  successMessage,
  positiveOption,
  negativeOption,
  submitButtonVariant = "default",
  mutation,
  showUpgradeButton = false,
  shouldCancelSubscription = false,
}) => {
  const { user } = useAuth();
  const [submitMutation, mutationState] = mutation;
  const [cancelSubscription, { isLoading: isCancellingSubscription }] =
    useCancelSubscriptionMutation();
  const { refetch: refetchUser } = useGetCurrentUserQuery();
  const isSubmitting = mutationState?.isLoading || isCancellingSubscription;

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      isSatisfied: false,
      message: "",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  // Reusable polling function for subscription status
  const pollForSubscriptionStatus = React.useCallback(() => {
    let attempts = 0;
    const maxAttempts = 20; // 20 attempts * 1 second = 20 seconds max
    const pollInterval = 1000; // 1 second

    const poll = async () => {
      try {
        const updatedUser = await refetchUser();
        const subscriptionStatus = updatedUser.data?.user?.subscription?.status;

        if (subscriptionStatus === "cancelled") {
          toast.success("Your subscription has been cancelled successfully!");
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          toast.warning(
            "Subscription cancellation is taking longer than expected. Please refresh the page or contact support if needed."
          );
        }
      } catch (pollError) {
        // Error polling for subscription status
        toast.warning(
          "Please refresh the page to check your subscription status."
        );
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 2000);
  }, [refetchUser]);

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      // First, submit feedback
      await submitMutation({
        message: data.message,
        isSatisfied: data.isSatisfied,
      }).unwrap();

      // If this is a subscription cancellation modal, also cancel the subscription
      if (
        shouldCancelSubscription &&
        user?.user?.subscription?.subscriptionId
      ) {
        try {
          const subscriptionResponse = await cancelSubscription({
            subscriptionId: user.user.subscription.subscriptionId,
          }).unwrap();

          // Check if subscription was successfully cancelled immediately
          if (subscriptionResponse.data.subscription.status === "cancelled") {
            // Immediate cancellation - refetch and show success
            await refetchUser();
            toast.success(
              "Your subscription has been cancelled successfully. Thank you for your feedback!"
            );
            form.reset();
            onClose();
            // Start background polling to ensure webhook updates are reflected
            pollForSubscriptionStatus();
          } else {
            // Webhook processing - close modal and poll in background
            toast.info(
              "Subscription cancellation is being processed. You'll be notified when complete."
            );
            form.reset();
            onClose();
            // Start background polling for webhook completion
            pollForSubscriptionStatus();
          }
        } catch (subscriptionError: any) {
          // Error cancelling subscription
          // Still show success for feedback, but warn about subscription
          toast.warning(
            "Feedback submitted, but there was an issue cancelling your subscription. Please contact support."
          );
          form.reset();
          onClose();
          return;
        }
      } else {
        // For regular feedback (not subscription cancellation)
        toast.success(successMessage);
        form.reset();
        onClose();
      }
    } catch (error: any) {
      // Error submitting

      // Extract error message from API response
      let errorMessage = "Failed to submit. Please try again.";

      // Handle backend error structure: error.data.message
      if (error?.data?.message) {
        errorMessage = error.data.message;
      }
      // Handle validation errors from backend controller
      else if (error?.data?.error?.message) {
        errorMessage = error.data.error.message;
      }
      // Handle generic error message
      else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    }
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Satisfaction Question */}
            <FormField
              control={form.control}
              name="isSatisfied"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    {satisfactionQuestion}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="satisfied-yes"
                          name="satisfaction"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor="satisfied-yes"
                          className="text-sm font-medium cursor-pointer"
                        >
                          {positiveOption}
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="satisfied-no"
                          name="satisfaction"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor="satisfied-no"
                          className="text-sm font-medium cursor-pointer"
                        >
                          {negativeOption}
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    {textareaLabel}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder={textareaPlaceholder}
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1 rounded">
                        {field.value?.length || 0}/1000
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                variant={submitButtonVariant}
                disabled={isSubmitting}
                className="flex-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>

              {showUpgradeButton && user?.user?.plan === "free" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUpgrade}
                  className="flex-1 cursor-pointer"
                >
                  Upgrade
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Original FeedbackModal as a wrapper
export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const submitFeedbackMutation = useSubmitFeedbackMutation();

  return (
    <GenericFeedbackModal
      isOpen={isOpen}
      onClose={onClose}
      onUpgrade={onUpgrade}
      title="Share Feedback"
      satisfactionQuestion="Are you satisfied with the search result?"
      textareaLabel="What can we improve?"
      textareaPlaceholder="Please share your thoughts on how we can improve our service..."
      submitButtonText="Submit"
      successMessage="Thank you for your feedback!"
      positiveOption="Yes"
      negativeOption="No"
      submitButtonVariant="default"
      mutation={submitFeedbackMutation}
      showUpgradeButton={true}
    />
  );
};

// Cancel Subscription Modal
export const CancelSubscriptionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const submitFeedbackMutation = useSubmitFeedbackMutation();

  return (
    <GenericFeedbackModal
      isOpen={isOpen}
      onClose={onClose}
      title="We're sorry to see you go"
      satisfactionQuestion="How was your experience with our service?"
      textareaLabel="Could you share the main reason for canceling?"
      textareaPlaceholder="Your feedback helps us improve—please let us know what could have been better."
      submitButtonText="Cancel Subscription"
      successMessage="Your subscription has been cancelled successfully. Thank you for your feedback!"
      positiveOption="Good"
      negativeOption="Bad"
      submitButtonVariant="destructive"
      mutation={submitFeedbackMutation}
      showUpgradeButton={false}
      shouldCancelSubscription={true}
    />
  );
};
