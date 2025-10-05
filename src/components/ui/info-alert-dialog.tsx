import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface InfoSection {
  variant: "info" | "warning" | "success" | "error";
  content: React.ReactNode;
}

export interface InfoAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  sections: InfoSection[];
  buttonText?: string;
  showPulsingIndicator?: boolean;
  pulsingIndicatorColor?: string;
}

const variantStyles = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
  },
  success: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
  },
};

export const InfoAlertDialog: React.FC<InfoAlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  sections,
  buttonText = "Got it, thanks!",
  showPulsingIndicator = false,
  pulsingIndicatorColor = "bg-green-500",
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            {showPulsingIndicator && (
              <div
                className={`w-3 h-3 ${pulsingIndicatorColor} rounded-full animate-pulse`}
              ></div>
            )}
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-2.5 pt-3">
            {sections.map((section, index) => {
              const styles = variantStyles[section.variant];
              return (
                <div
                  key={index}
                  className={`p-3 ${styles.bg} border ${styles.border} rounded-lg`}
                >
                  <div className={`text-sm ${styles.text} leading-relaxed`}>
                    {section.content}
                  </div>
                </div>
              );
            })}
            <div className="text-center pt-1">
              <AlertDialogAction
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                {buttonText}
              </AlertDialogAction>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
