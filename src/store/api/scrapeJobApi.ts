import { apiSlice } from "./apiSlice";
import {
  GetJobsResponse,
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
    getJobs: builder.query<GetJobsResponse["data"], void>({
      query: () => "/jobs",
      transformResponse: (response: GetJobsResponse) => response.data,
      providesTags: (result) =>
        result?.jobs
          ? [
              ...result.jobs.map(({ id }) => ({ type: "Jobs" as const, id })),
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
