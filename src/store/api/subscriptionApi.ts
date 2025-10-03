import { apiSlice } from "./apiSlice";
import {
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
} from "./types/subscription";

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    cancelSubscription: builder.mutation<
      CancelSubscriptionResponse,
      CancelSubscriptionRequest
    >({
      query: ({ subscriptionId }) => ({
        url: `/dodo-payments/subscriptions/${subscriptionId}`,
        method: "PATCH",
      }),
      transformResponse: (response: CancelSubscriptionResponse) => {
        return response;
      },
      invalidatesTags: ["User", "Auth"], // Invalidate user data to refresh subscription status
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          // Force refetch of user data after successful cancellation
          dispatch(apiSlice.util.invalidateTags(["User"]));
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useCancelSubscriptionMutation } = subscriptionApi;
