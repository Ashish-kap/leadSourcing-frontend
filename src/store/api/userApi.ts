import { apiSlice } from "./apiSlice";
import {
  ProfileUpdateRequest,
  ProfileUpdateSuccessResponse,
} from "./types/user";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<
      ProfileUpdateSuccessResponse,
      ProfileUpdateRequest
    >({
      query: (body) => ({
        url: "/users/me/profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ProfileUpdateSuccessResponse) => response,
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useUpdateProfileMutation } = userApi;
