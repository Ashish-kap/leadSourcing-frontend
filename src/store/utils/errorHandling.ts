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

export const handleApiError = (error: FetchBaseQueryError | undefined) => {
  if (!error) return;

  if ("status" in error) {
    if (error.status === "FETCH_ERROR") {
      toast.error("Network error. Please check your connection.");
      return;
    }

    if (error.status === "TIMEOUT_ERROR") {
      toast.error("Request timeout. Please try again.");
      return;
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
      return;
    }

    handleValidationErrors(errorData);
  } else {
    toast.error("An unexpected error occurred.");
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
    return;
  }

  // Second priority: show detail field if it exists
  if (errorData?.detail) {
    toast.error(errorData.detail);
    return;
  }

  // Filter out technical fields that shouldn't be shown to users
  const technicalFields = [
    "status",
    "error",
    "stack",
    "statusCode",
    "isOperational",
  ];

  // Handle field-specific validation errors (excluding technical fields)
  const validationEntries = Object.entries(errorData || {}).filter(
    ([field, _]) => !technicalFields.includes(field)
  );

  validationEntries.forEach(([field, messages]) => {
    if (Array.isArray(messages) && messages.length > 0) {
      toast.error(`${field}: ${messages[0]}`);
    } else if (typeof messages === "string") {
      toast.error(`${field}: ${messages}`);
    }
  });

  // Show generic message only if no specific errors were found
  if (validationEntries.length === 0) {
    toast.error("Validation error occurred.");
  }
};

// Hook for handling RTK Query errors in components
export const useErrorHandler = () => {
  return (error: FetchBaseQueryError | undefined) => {
    handleApiError(error);
  };
};
