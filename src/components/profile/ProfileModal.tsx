import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useUpdateProfileMutation } from "@/store/api/userApi";
import { handleApiError } from "@/store/utils/errorHandling";
import type { ProfileUpdateRequest } from "@/store/api/types/user";

const profileSchema = z.object({
  designation: z.string().min(1, "Designation is required"),
  website: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || z.string().url().safeParse(val).success, {
      message: "Please enter a valid URL",
    }),
  howDidYouHearAbout: z.string().min(1, "Please tell us how you heard about us"),
  userInfo: z.boolean().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<ProfileFormValues>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onOpenChange,
  initialValues,
}) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      designation: "",
      website: "",
      howDidYouHearAbout: "",
      userInfo: true,
    },
  });

  useEffect(() => {
    if (open && initialValues) {
      form.reset({
        designation: initialValues.designation ?? "",
        website: initialValues.website ?? "",
        howDidYouHearAbout: initialValues.howDidYouHearAbout ?? "",
        userInfo: true,
      });
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (data: ProfileFormValues) => {
    const body: ProfileUpdateRequest = {};
    if (data.designation !== undefined && data.designation !== "")
      body.designation = data.designation;
    if (data.website !== undefined && data.website !== "")
      body.website = data.website;
    if (data.howDidYouHearAbout !== undefined && data.howDidYouHearAbout !== "")
      body.howDidYouHearAbout = data.howDidYouHearAbout;
    if (data.userInfo !== undefined) body.userInfo = data.userInfo;

    try {
      await updateProfile(body).unwrap();
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error as FetchBaseQueryError);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <DialogTitle>Help us know you better</DialogTitle>
              <DialogDescription className="text-sm pt-1 text-muted-foreground">
              Fill this once and you won’t see this form again.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tell us a bit about yourself{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. I own a marketing agency..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://cazalead.com"
                      type="url"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="howDidYouHearAbout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    How did you hear about us?{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. LinkedIn, a friend, Google search..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px] cursor-pointer"
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
