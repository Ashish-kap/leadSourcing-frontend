import { apiSlice } from "./apiSlice";
import { FeedbackRequest, FeedbackResponse } from "./types/feedback";

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitFeedback: builder.mutation<FeedbackResponse, FeedbackRequest>({
      query: (feedbackData) => ({
        url: "/feedback",
        method: "POST",
        body: feedbackData,
      }),
      transformResponse: (response: FeedbackResponse) => {
        return response;
      },
      // No need to invalidate any tags since feedback is not cached
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitFeedbackMutation } = feedbackApi;
