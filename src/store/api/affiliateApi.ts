import { apiSlice } from "./apiSlice";
import { GetAffiliateResponse } from "./types/affiliate";

export const affiliateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliateData: builder.query<GetAffiliateResponse, void>({
      query: () => ({
        url: "/affiliate/me",
        method: "GET",
      }),
      transformResponse: (response: GetAffiliateResponse) => {
        return response;
      },
      providesTags: ["User"], // Use User tag since affiliate data is user-related
    }),
  }),
  overrideExisting: false,
});

export const { useGetAffiliateDataQuery } = affiliateApi;

