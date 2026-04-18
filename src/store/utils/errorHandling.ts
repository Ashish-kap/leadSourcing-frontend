import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "sonner";

interface ApiError {
  detail?: string;
  message?: string;
  status?: string;
  error?: any;
  stack?: string;
  [key: string]: any;
}

export interface ApiErrorHandlingResult {
  displayed: boolean;
  message?: string;
}

const TECHNICAL_FIELDS = [
  "status",
  "error",
  "stack",
  "statusCode",
  "isOperational",
];

export const handleApiError = (
  error: FetchBaseQueryError | undefined
): ApiErrorHandlingResult => {
  if (!error) {
    return { displayed: false };
  }

  if ("status" in error) {
    if (error.status === "FETCH_ERROR") {
      toast.error("Network error. Please check your connection.");
      return {
        displayed: true,
        message: "Network error. Please check your connection.",
      };
    }

    if (error.status === "TIMEOUT_ERROR") {
      toast.error("Request timeout. Please try again.");
      return {
        displayed: true,
        message: "Request timeout. Please try again.",
      };
    }

    const errorData = error?.data as ApiError;

    // Handle 402 Payment Required with upgrade button
    if (error.status === 402) {
      toast("Upgrade Required!", {
        description: errorData.message,
        action: {
          label: "Upgrade Now",
          onClick: () => {
            window.location.href = "/subscription";
          },
        },
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        className: "toast-action-left",
        duration: 10000, // Show for 10 seconds
        actionButtonStyle: {
          backgroundColor: "#3b82f6", // Professional blue
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
      });
      return { displayed: true, message: errorData?.message };
    }

    return handleValidationErrors(errorData);
  } else {
    toast.error("An unexpected error occurred.");
    return {
      displayed: true,
      message: "An unexpected error occurred.",
    };
  }
};

// const handleValidationErrors = (errorData: ApiError) => {
//   if (errorData?.detail) {
//     toast.error(errorData.detail);
//     return;
//   }

//   // Handle field-specific validation errors
//   Object.entries(errorData || {}).forEach(([field, messages]) => {
//     if (Array.isArray(messages) && messages.length > 0) {
//       toast.error(`${field}: ${messages[0]}`);
//     } else if (typeof messages === "string") {
//       toast.error(`${field}: ${messages}`);
//     }
//   });

//   if (Object.keys(errorData || {}).length === 0) {
//     toast.error("Validation error occurred.");
//   }
// };

const handleValidationErrors = (errorData: ApiError) => {
  // First priority: show the message field if it exists
  if (errorData?.message) {
    toast.error(errorData.message);
    return { displayed: true, message: errorData.message };
  }

  // Second priority: show detail field if it exists
  if (errorData?.detail) {
    toast.error(errorData.detail);
    return { displayed: true, message: errorData.detail };
  }

  // Handle field-specific validation errors (excluding technical fields).
  // Only show the first user-facing validation message to avoid duplicate toasts.
  const validationEntries = Object.entries(errorData || {}).filter(
    ([field, _]) => !TECHNICAL_FIELDS.includes(field)
  );

  const [firstField, firstMessages] = validationEntries[0] ?? [];

  if (firstField && Array.isArray(firstMessages) && firstMessages.length > 0) {
    const message = `${firstField}: ${firstMessages[0]}`;
    toast.error(message);
    return { displayed: true, message };
  }

  if (firstField && typeof firstMessages === "string") {
    const message = `${firstField}: ${firstMessages}`;
    toast.error(message);
    return { displayed: true, message };
  }

  // Show generic message only if no specific errors were found
  if (validationEntries.length === 0) {
    toast.error("Validation error occurred.");
    return {
      displayed: true,
      message: "Validation error occurred.",
    };
  }

  return { displayed: false };
};

// Hook for handling RTK Query errors in components
export const useErrorHandler = () => {
  return (error: FetchBaseQueryError | undefined) => {
    handleApiError(error);
  };
};
