import { apiSlice } from "./apiSlice";
import {
  GetLeadsParams,
  GetLeadsResponse,
  GetLeadResponse,
  UpdatePipelinePayload,
  BulkUpdatePayload,
  DraftEmailResponse,
  Lead,
  StartSearchPayload,
  StartSearchResponse,
  GetSearchesResponse,
} from "./types/audit";

const buildLeadsQuery = (params: GetLeadsParams = {}) => {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.jobId) qs.set("jobId", params.jobId);
  if (params.niche) qs.set("niche", params.niche);
  if (params.minScore != null) qs.set("minScore", String(params.minScore));
  if (params.maxScore != null) qs.set("maxScore", String(params.maxScore));
  if (params.issues) qs.set("issues", params.issues);
  if (params.pipelineStatus) qs.set("pipelineStatus", params.pipelineStatus);
  if (params.pinned != null) qs.set("pinned", String(params.pinned));
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);
  if (params.snippets) qs.set("snippets", "true");
  const s = qs.toString();
  return `/leads${s ? `?${s}` : ""}`;
};

export const leadsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<GetLeadsResponse, GetLeadsParams | void>({
      query: (params) => buildLeadsQuery(params || {}),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((l) => ({ type: "Leads" as const, id: l._id })),
              { type: "Leads", id: "LIST" },
            ]
          : [{ type: "Leads", id: "LIST" }],
    }),

    getLead: builder.query<GetLeadResponse, string>({
      query: (leadId) => `/leads/${leadId}`,
      providesTags: (_r, _e, leadId) => [{ type: "Leads", id: leadId }],
    }),

    updateLeadPipeline: builder.mutation<{ status: string; data: Lead }, UpdatePipelinePayload>({
      query: ({ leadId, ...body }) => ({
        url: `/leads/${leadId}/pipeline`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { leadId }) => [
        { type: "Leads", id: leadId },
        { type: "Leads", id: "LIST" },
      ],
    }),

    bulkUpdateLeads: builder.mutation<
      { status: string; matched: number; modified: number },
      BulkUpdatePayload
    >({
      query: (body) => ({ url: "/leads/bulk-update", method: "POST", body }),
      invalidatesTags: [{ type: "Leads", id: "LIST" }],
    }),

    deleteLead: builder.mutation<void, string>({
      query: (leadId) => ({ url: `/leads/${leadId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, leadId) => [
        { type: "Leads", id: leadId },
        { type: "Leads", id: "LIST" },
      ],
    }),

    bulkDeleteLeads: builder.mutation<
      { status: string; deleted: number },
      { leadIds: string[] }
    >({
      query: (body) => ({ url: "/leads/bulk-delete", method: "POST", body }),
      invalidatesTags: [{ type: "Leads", id: "LIST" }],
    }),

    // ── v2 lead searches ──
    startLeadSearch: builder.mutation<StartSearchResponse, StartSearchPayload>({
      query: (body) => ({ url: "/leads/searches", method: "POST", body }),
      invalidatesTags: ["User", { type: "Searches", id: "LIST" }],
    }),

    getLeadSearches: builder.query<
      GetSearchesResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));
        const s = qs.toString();
        return `/leads/searches${s ? `?${s}` : ""}`;
      },
      providesTags: [{ type: "Searches", id: "LIST" }],
    }),

    deleteLeadSearch: builder.mutation<void, string>({
      query: (jobId) => ({ url: `/leads/searches/${jobId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Searches", id: "LIST" }],
    }),

    // AI email draft consumes a credit on success → refresh User (credits/usage).
    draftLeadEmail: builder.mutation<
      DraftEmailResponse,
      { leadId: string; senderName?: string }
    >({
      query: ({ leadId, senderName }) => ({
        url: `/leads/${leadId}/email`,
        method: "POST",
        body: { senderName },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  // Dev only: let endpoint/tag edits hot-reload (RTK skips re-injection when
  // false, so changed invalidatesTags would otherwise stay stale until a full
  // page reload). No effect in production.
  overrideExisting: import.meta.env.DEV,
});

export const {
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
  useGetLeadQuery,
  useUpdateLeadPipelineMutation,
  useBulkUpdateLeadsMutation,
  useDeleteLeadMutation,
  useBulkDeleteLeadsMutation,
  useDraftLeadEmailMutation,
  useStartLeadSearchMutation,
  useGetLeadSearchesQuery,
  useDeleteLeadSearchMutation,
} = leadsApi;
