import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

// Base URL configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, {}) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Enhanced base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    // Checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const authToken = localStorage.getItem("authToken");

        if (refreshToken && authToken) {
          const refreshResult = await baseQuery(
            {
              url: "/token/refresh/",
              method: "POST",
              body: { token: refreshToken },
              headers: { authorization: `Bearer ${authToken}` },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { access } = refreshResult.data as { access: string };
            localStorage.setItem("authToken", access);

            // Retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Refresh failed, logout user
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } else {
          // No refresh token available, logout user
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      } finally {
        release();
      }
    } else {
      // Wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Create the main API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Auth", "Workspace", "Jobs"],
  endpoints: () => ({}),
});

export default apiSlice;
