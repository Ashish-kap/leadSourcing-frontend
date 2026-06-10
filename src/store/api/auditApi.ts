import { apiSlice } from "./apiSlice";
import {
  NicheOption,
  StartAuditPayload,
  StartAuditResponse,
  GetAuditJobResponse,
} from "./types/audit";

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNiches: builder.query<NicheOption[], void>({
      query: () => "/audit/niches",
      transformResponse: (r: { status: string; data: NicheOption[] }) => r.data,
      providesTags: ["Niches"],
    }),

    startAudit: builder.mutation<StartAuditResponse, StartAuditPayload>({
      query: (body) => ({ url: "/audit/start", method: "POST", body }),
      // Only credits change synchronously. Per-lead row/detail updates arrive
      // via the lead_updated socket event and are patched into the cache in
      // place (see Leads.tsx) — deliberately NOT invalidating the Leads list, so
      // the list doesn't refetch + re-sort and yank rows the user is watching.
      invalidatesTags: ["User", "Audit"],
    }),

    reauditLead: builder.mutation<
      { status: string; auditJobId: string; mode: string },
      { leadId: string; niche?: string; mode?: string }
    >({
      query: ({ leadId, ...body }) => ({
        url: `/audit/lead/${leadId}/reaudit`,
        method: "POST",
        body,
      }),
      // Same as startAudit: socket patches the row/detail in place; don't
      // invalidate Leads or the list would refetch + re-sort.
      invalidatesTags: ["User"],
    }),

    getAuditStatus: builder.query<GetAuditJobResponse, string>({
      query: (auditJobId) => `/audit/${auditJobId}`,
      providesTags: (_r, _e, id) => [{ type: "Audit", id }],
    }),
  }),
  // Dev only: let endpoint/tag edits hot-reload (see leadsApi for why).
  overrideExisting: import.meta.env.DEV,
});

export const {
  useGetNichesQuery,
  useStartAuditMutation,
  useReauditLeadMutation,
  useGetAuditStatusQuery,
} = auditApi;
