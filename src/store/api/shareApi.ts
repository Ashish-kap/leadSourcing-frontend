import { apiSlice } from "./apiSlice";
import { CreateShareResponse, GetPublicShareResponse } from "./types/share";

export const shareApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin-only: create (or fetch the existing) public link for a search.
    createShare: builder.mutation<CreateShareResponse, string>({
      query: (jobId) => ({
        url: `/share/searches/${jobId}`,
        method: "POST",
      }),
    }),

    // Public — works without an auth token (prepareHeaders skips the header).
    getPublicShare: builder.query<GetPublicShareResponse, string>({
      query: (shareId) => `/share/${shareId}`,
    }),
  }),
  overrideExisting: import.meta.env.DEV,
});

export const { useCreateShareMutation, useGetPublicShareQuery } = shareApi;
