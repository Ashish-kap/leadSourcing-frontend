import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSubmitFeedbackMutation } from "@/store/api/feedbackApi";

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
  message: z.string().min(1, "Please provide your feedback"),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [submitFeedback, { isLoading: isSubmitting }] =
    useSubmitFeedbackMutation();

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      isSatisfied: false,
      message: "",
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      await submitFeedback({
        message: data.message,
        isSatisfied: data.isSatisfied,
      }).unwrap();

      toast.success("Thank you for your feedback!");
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Share Feedback
          </DialogTitle>
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
                    Are you satisfied with the search result?
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
                          Yes
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
                          No
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
                    What can we improve?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please share your thoughts on how we can improve our service..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleUpgrade}
                className="flex-1 cursor-pointer"
              >
                Upgrade
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
