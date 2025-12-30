import { apiSlice } from "./apiSlice";
import {
  GetJobsResponse,
  GetJobsQueryParams,
  scrapeJobPostRequest,
  scrapeJobPostResponse,
} from "./types/scrapeJob";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    scrapeJobPost: builder.mutation<
      scrapeJobPostResponse,
      scrapeJobPostRequest
    >({
      query: (credentials) => ({
        url: "/scrape",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: scrapeJobPostResponse) => {
        return response;
      },
      invalidatesTags: ["Auth", "User", "Jobs"],
    }),
    // GET /jobs
    getJobs: builder.query<GetJobsResponse, GetJobsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.status) queryParams.append("status", params.status);
          if (params.keyword) queryParams.append("keyword", params.keyword);
          if (params.startDate) queryParams.append("startDate", params.startDate);
          if (params.endDate) queryParams.append("endDate", params.endDate);
          if (params.sort) queryParams.append("sort", params.sort);
          else if (params.sortBy) {
            const order = params.order || "desc";
            queryParams.append("sortBy", params.sortBy);
            queryParams.append("order", order);
          }
        }
        
        const queryString = queryParams.toString();
        return `/jobs${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (response: GetJobsResponse) => response,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Jobs" as const, id })),
              { type: "Jobs", id: "LIST" },
            ]
          : [{ type: "Jobs", id: "LIST" }],
    }),

    downloadJobCsv: builder.query<Blob, string>({
      query: (jobId) => ({
        url: `/${jobId}/download`,
        method: "GET",
        responseHandler: async (response) => {
          return await response.blob();
        },
      }),
    }),

    deleteJob: builder.mutation<{ message: string }, string>({
      query: (jobId) => ({
        url: `/delete/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, jobId) => [
        { type: "Jobs", id: jobId },
        { type: "Jobs", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useScrapeJobPostMutation,
  useGetJobsQuery,
  useLazyDownloadJobCsvQuery,
  useDeleteJobMutation,
} = authApi;
