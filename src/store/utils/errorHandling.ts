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
    handleValidationErrors(errorData);
    // Handle different error status codes
    // switch (error.status) {
    //   case 400:
    //     handleValidationErrors(errorData);
    //     break;
    //   case 401:
    //     toast.error("Authentication required. Please log in.");
    //     break;
    //   case 403:
    //     toast.error("Access denied. You do not have permission.");
    //     break;
    //   case 404:
    //     toast.error("Resource not found.");
    //     break;
    //   case 500:
    //     toast.error("Server error. Please try again later.");
    //     break;
    //   default:
    //     toast.error(errorData?.detail || "An unexpected error occurred.");
    // }
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
