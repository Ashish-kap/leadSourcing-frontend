import { apiSlice } from "./apiSlice";
import {
  MeResponse,
  LoginRequest,
  SignupRequest,
  LoginResponse,
} from "./types/auth";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => {
        if (response?.token) {
          localStorage.setItem("authToken", response.token);
          if (response.refresh) {
            localStorage.setItem("refreshToken", response.token);
          }
        }
        return response;
      },
      invalidatesTags: ["Auth"],
    }),

    signup: builder.mutation<LoginResponse, SignupRequest>({
      query: (credentials) => ({
        url: "/users/signup",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => {
        if (response?.token) {
          localStorage.setItem("authToken", response.token);
          if (response.refresh) {
            localStorage.setItem("refreshToken", response.token);
          }
        }
        return response;
      },
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          // Clean up regardless of API response
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("workspaceId");
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    googleAuth: builder.mutation<LoginResponse, { googleToken: string }>({
      query: ({ googleToken }) => ({
        url: "/users/auth/google/token",
        method: "POST",
        body: { authToken: googleToken },
      }),
      transformResponse: (response: LoginResponse) => {
        if (response?.token) {
          localStorage.setItem("authToken", response.token);
          if (response.refresh) {
            localStorage.setItem("refreshToken", response.token);
          }
        }
        return response;
      },
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<{ access: string }, { token: string }>({
      query: (body) => ({
        url: "/token/refresh/",
        method: "POST",
        body,
      }),
    }),

    getCurrentUser: builder.query<MeResponse["data"], void>({
      query: () => "/users/me",
      transformResponse: (response: MeResponse) => response.data,
      providesTags: ["User"],
    }),

    verifyToken: builder.query<{ valid: boolean }, void>({
      query: () => "/users/verify-token",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGoogleAuthMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useVerifyTokenQuery,
} = authApi;
