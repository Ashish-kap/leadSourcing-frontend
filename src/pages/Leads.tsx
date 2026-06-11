import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Eye,
  Gauge,
  Loader2,
  Star,
  ArrowLeft,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ScoreBadge } from "@/components/leads/ScoreBadge";
import { IssueBadges } from "@/components/leads/IssueBadges";
import { NicheSelect } from "@/components/leads/NicheSelect";
import { LeadDetailDialog } from "@/components/leads/LeadDetailDialog";
import { EmailDraftDialog } from "@/components/leads/EmailDraftDialog";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import {
  leadsApi,
  useGetLeadsQuery,
  useLazyGetLeadsQuery,
  useBulkUpdateLeadsMutation,
  useUpdateLeadPipelineMutation,
  useDeleteLeadMutation,
  useBulkDeleteLeadsMutation,
} from "@/store/api/leadsApi";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  useReauditLeadMutation,
  useStartAuditMutation,
} from "@/store/api/auditApi";
import { useGetCurrentUserQuery } from "@/store/api/authApi";
import { useAuditSocket } from "@/store/hooks/useAuditSocket";
import { GetLeadsParams, Lead, PipelineStatus } from "@/store/api/types/audit";
import { toast } from "sonner";

const PIPELINE_BADGE: Record<PipelineStatus, string> = {
  new: "bg-muted text-muted-foreground",
  contacted: "bg-amber-500/15 text-amber-600",
  replied: "bg-blue-500/15 text-blue-600",
  won: "bg-emerald-500/15 text-emerald-600",
  lost: "bg-destructive/15 text-destructive",
};

const STAGE_OPTIONS: PipelineStatus[] = [
  "new",
  "contacted",
  "replied",
  "won",
  "lost",
];

// Score bucket → query params (lower score = stronger prospect).
const SCORE_BUCKETS: Record<string, { minScore?: number; maxScore?: number }> =
  {
    all: {},
    weak: { maxScore: 49 },
    medium: { minScore: 50, maxScore: 79 },
    strong: { minScore: 80 },
  };

const PAGE_SIZE = 20;

// Per-row stage dropdown — each instance owns its own mutation state so one
// row's update doesn't spin every row.
const StageSelect: React.FC<{ lead: Lead }> = ({ lead }) => {
  const [update, { isLoading }] = useUpdateLeadPipelineMutation();
  const current = lead.pipeline?.status || "new";
  return (
    <Select
      value={current}
      onValueChange={async (v) => {
        if (v === current) return;
        try {
          await update({
            leadId: lead._id,
            status: v as PipelineStatus,
          }).unwrap();
        } catch {
          toast.error("Failed to update stage.");
        }
      }}
    >
      <SelectTrigger
        className={cn(
          "h-7 w-[110px] border-0 capitalize",
          PIPELINE_BADGE[current],
        )}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {STAGE_OPTIONS.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Per-row re-audit button — re-runs the audit for a single lead (exempt from the
// free bulk cap). Reuses the lead's stored niche on the backend.
const ReauditButton: React.FC<{ lead: Lead }> = ({ lead }) => {
  const [reaudit, { isLoading }] = useReauditLeadMutation();
  const running = lead.audit?.status === "running" || isLoading;
  const hasAudit = lead.audit?.score != null;
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      disabled={running}
      onClick={async () => {
        try {
          await reaudit({ leadId: lead._id }).unwrap();
          toast.success("Audit started for this lead.");
        } catch (e) {
          const msg =
            (e as { data?: { message?: string } })?.data?.message ||
            "Failed to start audit.";
          toast.error(msg);
        }
      }}
      title={hasAudit ? "Re-audit this lead" : "Audit this lead"}
    >
      {running ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : hasAudit ? (
        <RefreshCw className="h-4 w-4" />
      ) : (
        <Gauge className="h-4 w-4" />
      )}
    </Button>
  );
};

const Leads: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const jobId = params.get("jobId") || undefined;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); // immediate field value
  const [search, setSearch] = useState(""); // debounced → query
  const [activeProgress, setActiveProgress] = useState<number | null>(null);
  const [niche, setNiche] = useState("all");
  const [scoreBucket, setScoreBucket] = useState("all");
  const [pipelineStatus, setPipelineStatus] = useState("all");
  const [sort, setSort] = useState("audit.score"); // worst first by default
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [detailId, setDetailId] = useState<string | null>(null);
  const [emailLead, setEmailLead] = useState<Lead | null>(null);
  // Run-level progress for the toolbar chip while an audit is in flight.
  const [auditProgress, setAuditProgress] = useState<{
    completed: number;
    failed: number;
    total: number;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const [startAudit, { isLoading: isStartingAudit }] = useStartAuditMutation();

  // Debounce the search field into the query param.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Single source of truth for the query args so the cache patch below targets
  // the exact same cache entry this component is reading.
  const queryArgs = useMemo<GetLeadsParams>(
    () => ({
      page,
      limit: PAGE_SIZE,
      jobId,
      search: search || undefined,
      niche: niche === "all" ? undefined : niche,
      pipelineStatus:
        pipelineStatus === "all"
          ? undefined
          : (pipelineStatus as PipelineStatus),
      sort,
      ...(SCORE_BUCKETS[scoreBucket] || {}),
    }),
    [page, jobId, search, niche, pipelineStatus, sort, scoreBucket],
  );

  const { data, isFetching, refetch } = useGetLeadsQuery(queryArgs);
  const { refetch: refetchUser } = useGetCurrentUserQuery();
  const [bulkUpdate, { isLoading: isBulkUpdating }] =
    useBulkUpdateLeadsMutation();
  const [fetchAllLeads, { isFetching: isSelectingAll }] =
    useLazyGetLeadsQuery();
  const [deleteLead, { isLoading: isDeletingLead }] = useDeleteLeadMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] =
    useBulkDeleteLeadsMutation();

  // Patch a single lead in the current cache entry in place — no refetch, so
  // the server doesn't re-sort and the row the user is watching never jumps.
  const patchLead = (leadId: string, fields: Partial<Lead>) => {
    dispatch(
      leadsApi.util.updateQueryData("getLeads", queryArgs, (draft) => {
        const l = draft.data.find((x) => x._id === leadId);
        if (l) Object.assign(l, fields);
      }),
    );
    // Keep the open detail dialog (getLead) in sync too, in place.
    dispatch(
      leadsApi.util.updateQueryData("getLead", leadId, (draft) => {
        if (draft.data) Object.assign(draft.data, fields);
      }),
    );
    // Talking points (snippets) are derived server-side from the lead's issues
    // and aren't in the socket payload, so the in-place patch above leaves them
    // stale. If this lead's detail dialog is open and its audit changed, refetch
    // just that one detail query so the server rebuilds snippets — the list is
    // untouched, so nothing re-sorts.
    if (fields.audit && leadId === detailId) {
      dispatch(
        leadsApi.endpoints.getLead.initiate(leadId, {
          forceRefetch: true,
          subscribe: false,
        }),
      );
    }
  };

  // Realtime: update rows in place during an audit (so they don't re-sort away);
  // only fall back to a full refetch when a brand-new lead arrives (scrape).
  const { isConnected } = useAuditSocket({
    onLeadUpdated: (d) => {
      const fields: Partial<Lead> = {};
      if (d.audit) fields.audit = d.audit;
      if (d.pipeline) fields.pipeline = d.pipeline;
      if (d.lead) Object.assign(fields, d.lead);
      if (Object.keys(fields).length && d.leadId) patchLead(d.leadId, fields);
      else refetch();
    },
    onLeadCreated: () => refetch(), // stream new leads in live during a search
    onAuditProgress: (d) => {
      setAuditProgress({
        completed: d.completed ?? 0,
        failed: d.failed ?? 0,
        total: d.total ?? 0,
      });
    },
    onAuditUpdate: (d) => {
      // Credits changed; refresh the user. Don't refetch leads here — that would
      // re-sort the list mid-run. Per-lead rows are kept fresh via lead_updated.
      refetchUser();
      if (d.type === "audit_started") {
        setAuditProgress({ completed: 0, failed: 0, total: d.totalLeads ?? 0 });
      }
    },
    onJobProgress: (d) => {
      if (jobId && d.jobId === jobId)
        setActiveProgress(d.progress?.percentage ?? null);
    },
  });

  // Clear the progress chip a moment after the run finishes.
  useEffect(() => {
    if (!auditProgress || !auditProgress.total) return;
    const done = auditProgress.completed + auditProgress.failed;
    if (done >= auditProgress.total) {
      const t = setTimeout(() => setAuditProgress(null), 4000);
      return () => clearTimeout(t);
    }
  }, [auditProgress]);

  const leads = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const resetPage = () => setPage(1);

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const pageIds = leads.map((l) => l._id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const togglePage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });

  const selectedIds = [...selected];

  // sourceJobId for auditing: the jobId filter, or a shared lastJobId across selection.
  const sourceJobId = useMemo(() => {
    if (jobId) return jobId;
    const sel = leads.filter((l) => selected.has(l._id));
    const jobs = new Set(
      sel.map((l) => l.lastJobId).filter(Boolean) as string[],
    );
    return jobs.size === 1 ? [...jobs][0] : undefined;
  }, [jobId, leads, selected]);

  // Audits aren't billed, so there's no dialog — clicking runs the audit straight
  // away. Niche follows the active filter when one is set (else the generic
  // rubric); audit depth is auto-resolved server-side.
  const runAudit = async (ids: string[]) => {
    if (!ids.length) return;
    try {
      const res = await startAudit({
        sourceJobId,
        leadIds: ids,
        niche: niche === "all" ? "default" : niche,
      }).unwrap();
      toast.success(
        `Audit started for ${res.totalLeads} lead${res.totalLeads === 1 ? "" : "s"}.`,
      );
      setSelected(new Set());
    } catch (err: any) {
      // Surfaces the free-plan bulk cap message (402) when it applies.
      toast.error(err?.data?.message || "Could not start the audit.");
    }
  };

  // The header checkbox only covers the current page. When more results exist,
  // offer to pull every matching lead's id (across all pages) into the selection.
  const selectAllMatching = async () => {
    try {
      const res = await fetchAllLeads({
        ...queryArgs,
        page: 1,
        limit: total,
      }).unwrap();
      setSelected(new Set(res.data.map((l) => l._id)));
    } catch {
      toast.error("Couldn't select all leads.");
    }
  };

  const applyBulkPipeline = async (status: PipelineStatus) => {
    if (!selectedIds.length) return;
    try {
      await bulkUpdate({ leadIds: selectedIds, pipeline: { status } }).unwrap();
      toast.success(`Updated ${selectedIds.length} lead(s) to "${status}".`);
      setSelected(new Set());
    } catch {
      toast.error("Bulk update failed.");
    }
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return;
    try {
      const res = await bulkDelete({ leadIds: selectedIds }).unwrap();
      toast.success(`Deleted ${res.deleted} lead(s).`);
      setSelected(new Set());
    } catch {
      toast.error("Could not delete the leads.");
    }
  };

  const deleteOne = async (lead: Lead) => {
    try {
      await deleteLead(lead._id).unwrap();
      setSelected((prev) => {
        if (!prev.has(lead._id)) return prev;
        const next = new Set(prev);
        next.delete(lead._id);
        return next;
      });
      toast.success(`Deleted "${lead.businessName}".`);
    } catch {
      toast.error("Could not delete the lead.");
    }
  };

  const scraping =
    jobId != null && activeProgress != null && activeProgress < 100;
  // After a scrape finishes, nudge the user toward the audit step — leads are
  // not audited automatically.
  const hasUnaudited = leads.some(
    (l) => l.audit?.status === "pending" || l.audit?.score == null,
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          {/* {jobId && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-1 -ml-2 w-fit text-muted-foreground"
              onClick={() => navigate("/find-leads")}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to searches
            </Button>
          )} */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Leads</CardTitle>
                <span
                  className={cn(
                    "text-xs",
                    isConnected ? "text-emerald-600" : "text-muted-foreground",
                  )}
                >
                  {isConnected ? "● Live" : "○ Offline"}
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 pt-3 lg:flex-row lg:items-center">
                <div className="relative w-full lg:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search business, website, city…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <NicheSelect
                  value={niche}
                  onChange={(v) => {
                    setNiche(v);
                    resetPage();
                  }}
                  includeAll
                  placeholder="All niches"
                  className="w-full lg:w-44"
                />
                <Select
                  value={scoreBucket}
                  onValueChange={(v) => {
                    setScoreBucket(v);
                    resetPage();
                  }}
                >
                  <SelectTrigger className="w-full lg:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All scores</SelectItem>
                    <SelectItem value="weak">Weak (&lt;50)</SelectItem>
                    <SelectItem value="medium">Medium (50–79)</SelectItem>
                    <SelectItem value="strong">Strong (80+)</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={pipelineStatus}
                  onValueChange={(v) => {
                    setPipelineStatus(v);
                    resetPage();
                  }}
                >
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={(v) => setSort(v)}>
                  <SelectTrigger className="w-full lg:w-44">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audit.score">
                      Worst score first
                    </SelectItem>
                    <SelectItem value="-audit.score">
                      Best score first
                    </SelectItem>
                    <SelectItem value="-createdAt">Newest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk action bar */}
              {selectedIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 p-2 mt-3">
                  <span className="text-sm font-medium px-1">
                    {selectedIds.length} selected
                  </span>
                  {allOnPageSelected && total > selectedIds.length && (
                    <Button
                      size="sm"
                      variant="link"
                      className="h-8 px-1"
                      disabled={isSelectingAll}
                      onClick={selectAllMatching}
                    >
                      {isSelectingAll ? "Selecting…" : `Select all ${total}`}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={isStartingAudit}
                    onClick={() => runAudit(selectedIds)}
                  >
                    {isStartingAudit ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Gauge className="mr-2 h-4 w-4" />
                    )}{" "}
                    Run audit
                  </Button>
                  <Select
                    onValueChange={(v) =>
                      applyBulkPipeline(v as PipelineStatus)
                    }
                  >
                    <SelectTrigger
                      className="h-8 w-40"
                      disabled={isBulkUpdating}
                    >
                      <SelectValue placeholder="Set stage…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <DeleteConfirmDialog
                    description={`Delete ${selectedIds.length} selected lead${selectedIds.length === 1 ? "" : "s"}? This can't be undone.`}
                    onConfirm={deleteSelected}
                    isLoading={isBulkDeleting}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </DeleteConfirmDialog>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelected(new Set())}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {scraping && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-foreground">
                    Scraping leads for this search…{" "}
                    {Math.round(activeProgress!)}% — new leads appear below
                    automatically.
                  </span>
                </div>
              )}

              {auditProgress && auditProgress.total > 0 && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                  {auditProgress.completed + auditProgress.failed >=
                  auditProgress.total ? (
                    <Gauge className="h-4 w-4 text-primary" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  <span className="text-sm text-foreground">
                    {auditProgress.completed + auditProgress.failed >=
                    auditProgress.total
                      ? `Audit complete — ${auditProgress.completed} of ${auditProgress.total} scored. Rows update in place; sort to re-rank.`
                      : `Auditing ${auditProgress.total} lead${auditProgress.total === 1 ? "" : "s"} — ${auditProgress.completed + auditProgress.failed}/${auditProgress.total} done. Scores fill in below without reordering.`}
                  </span>
                </div>
              )}

              {/* Audit doesn't run automatically after scraping — tell the user
                  how to start it once leads exist. */}
              {!scraping && leads.length > 0 && hasUnaudited && (
                <div className="mb-4 flex flex-col gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <span className="text-sm text-foreground">
                      These leads aren&apos;t audited yet. Select rows and{" "}
                      <strong>Run audit</strong>, or audit one at a time with
                      the <Gauge className="inline h-3.5 w-3.5" /> button in the
                      Actions column.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0"
                    disabled={isStartingAudit}
                    onClick={() => runAudit(pageIds)}
                  >
                    <Gauge className="mr-2 h-4 w-4" /> Audit these leads
                  </Button>
                </div>
              )}

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10 bg-muted/50">
                          <Checkbox
                            checked={allOnPageSelected}
                            onCheckedChange={togglePage}
                            aria-label="Select page"
                          />
                        </TableHead>
                        <TableHead className="bg-muted/50">Business</TableHead>
                        <TableHead className="bg-muted/50">Contact</TableHead>
                        <TableHead className="bg-muted/50 w-20 text-center">
                          Score
                        </TableHead>
                        <TableHead className="bg-muted/50">Issues</TableHead>
                        <TableHead className="bg-muted/50 w-[120px]">
                          Stage
                        </TableHead>
                        <TableHead className="bg-muted/50 w-32 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isFetching && leads.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      ) : leads.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No leads found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        leads.map((lead) => (
                          <TableRow
                            key={lead._id}
                            className={cn(
                              "hover:bg-muted/50 cursor-pointer",
                              lead.audit?.status === "running" &&
                                "bg-primary/5",
                            )}
                            onClick={() => setDetailId(lead._id)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selected.has(lead._id)}
                                onCheckedChange={() => toggleOne(lead._id)}
                                aria-label={`Select ${lead.businessName}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {lead.pipeline?.pinned && (
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                )}
                                <div className="min-w-0">
                                  <div className="font-medium truncate max-w-[240px]">
                                    {lead.businessName}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {typeof lead.rating === "number" && (
                                      <span className="flex items-center gap-0.5">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        {lead.rating.toFixed(1)}
                                        {typeof lead.reviewsCount ===
                                          "number" && (
                                          <span className="ml-0.5">
                                            ({lead.reviewsCount})
                                          </span>
                                        )}
                                      </span>
                                    )}
                                    <span className="truncate max-w-[200px]">
                                      {lead.website
                                        ? lead.website.replace(
                                            /^https?:\/\//,
                                            "",
                                          )
                                        : [lead.city, lead.state]
                                            .filter(Boolean)
                                            .join(", ") || "No website"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col gap-1 text-xs">
                                {lead.phone ? (
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="flex items-center gap-1 text-foreground hover:underline"
                                  >
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    {lead.phone}
                                  </a>
                                ) : null}
                                {lead.email ? (
                                  <a
                                    href={`mailto:${lead.email}`}
                                    className="flex items-center gap-1 text-foreground hover:underline truncate max-w-[180px]"
                                  >
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    <span className="truncate">
                                      {lead.email}
                                    </span>
                                  </a>
                                ) : null}
                                {!lead.phone && !lead.email && (
                                  <span className="text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {lead.audit?.status === "running" ? (
                                <Loader2
                                  className="mx-auto h-4 w-4 animate-spin text-primary"
                                  aria-label="Auditing"
                                />
                              ) : (
                                <ScoreBadge
                                  score={lead.audit?.score}
                                  size="sm"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <IssueBadges
                                issues={lead.audit?.issues}
                                max={3}
                              />
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <StageSelect lead={lead} />
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setDetailId(lead._id)}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <ReauditButton lead={lead} />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setEmailLead(lead)}
                                  title="Draft email"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <DeleteConfirmDialog
                                  description={`Delete "${lead.businessName}"? This can't be undone.`}
                                  onConfirm={() => deleteOne(lead)}
                                  isLoading={isDeletingLead}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                    title="Delete lead"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DeleteConfirmDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {total > 0
                    ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                        page * PAGE_SIZE,
                        total,
                      )} of ${total}`
                    : "0 results"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Dialogs */}
      <LeadDetailDialog
        leadId={detailId}
        open={!!detailId}
        onOpenChange={(o) => !o && setDetailId(null)}
      />
      {emailLead && (
        <EmailDraftDialog
          leadId={emailLead._id}
          businessName={emailLead.businessName}
          open={!!emailLead}
          onOpenChange={(o) => !o && setEmailLead(null)}
        />
      )}
    </div>
  );
};

export default Leads;
