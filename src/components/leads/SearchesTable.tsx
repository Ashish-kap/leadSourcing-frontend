import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Trash2,
  ArrowRight,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetLeadSearchesQuery,
  useDeleteLeadSearchMutation,
} from "@/store/api/leadsApi";
import { useGetCurrentUserQuery } from "@/store/api/authApi";
import { useCreateShareMutation } from "@/store/api/shareApi";
import { useAuditSocket } from "@/store/hooks/useAuditSocket";
import { useExportLeads } from "@/store/hooks/useExportLeads";

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-600",
  active: "bg-amber-500/15 text-amber-600",
  waiting: "bg-amber-500/15 text-amber-600",
  failed: "bg-destructive/15 text-destructive",
  data_not_found: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 10;
const ACTIVE = new Set(["waiting", "active", "delayed"]);

export const SearchesTable: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const { data, refetch } = useGetLeadSearchesQuery({ page, limit: PAGE_SIZE });
  const { data: me, refetch: refetchUser } = useGetCurrentUserQuery();
  const [deleteSearch, { isLoading: isDeleting }] = useDeleteLeadSearchMutation();
  const [createShare, { isLoading: isSharing }] = useCreateShareMutation();
  const { exportLeads, isExporting } = useExportLeads();
  const isAdmin = me?.user?.role === "admin";

  const onShare = async (jobId: string) => {
    try {
      const res = await createShare(jobId).unwrap();
      await navigator.clipboard.writeText(
        `${window.location.origin}/share/${res.shareId}${res.refCode ? `?ref=${res.refCode}` : ""}`,
      );
      toast.success("Public link copied — anyone can view it without login.");
    } catch {
      toast.error("Could not create the share link.");
    }
  };

  useAuditSocket({
    onJobProgress: (d) =>
      setProgressMap((prev) => ({ ...prev, [d.jobId]: d.progress?.percentage ?? prev[d.jobId] })),
    onJobUpdate: () => {
      refetch();
      refetchUser();
    },
  });

  const rows = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const onDelete = async (jobId: string, keyword: string) => {
    try {
      await deleteSearch(jobId).unwrap();
      toast.success(`Deleted search "${keyword}".`);
    } catch {
      toast.error("Could not delete the search.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your searches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted/50">Keyword</TableHead>
                  <TableHead className="bg-muted/50">Location</TableHead>
                  <TableHead className="bg-muted/50 w-40">Progress</TableHead>
                  <TableHead className="bg-muted/50 text-center">Leads</TableHead>
                  <TableHead className="bg-muted/50">Status</TableHead>
                  <TableHead className="bg-muted/50">Date</TableHead>
                  <TableHead className="bg-muted/50 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No searches yet. Start one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((s) => {
                    const isActive = ACTIVE.has(s.status);
                    const pct = isActive
                      ? progressMap[s.jobId] ?? s.progress
                      : s.status === "completed"
                      ? 100
                      : s.progress;
                    return (
                      <TableRow key={s.jobId} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{s.keyword}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {s.location || "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-2 flex-1" />
                            {isActive && (
                              <Loader2 className="h-3 w-3 animate-spin text-primary" />
                            )}
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {Math.round(pct)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {s.leadsFound}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("capitalize", STATUS_BADGE[s.status] || "")}>
                            {s.status === "data_not_found" ? "No data" : s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => navigate(`/leads?jobId=${s.jobId}`)}
                              title="View leads"
                            >
                              View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                            {isAdmin && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                disabled={
                                  isSharing ||
                                  s.status !== "completed" ||
                                  s.leadsFound === 0
                                }
                                onClick={() => onShare(s.jobId)}
                                title="Copy public share link"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              disabled={isExporting || s.leadsFound === 0}
                              onClick={() =>
                                exportLeads(
                                  { jobId: s.jobId },
                                  `${s.keyword}-leads.csv`
                                )
                              }
                              title="Export CSV"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <DeleteConfirmDialog
                              description={
                                isActive
                                  ? `Cancel and delete the search "${s.keyword}"? Unused credits are refunded; leads found so far stay in your pool.`
                                  : `Delete the search "${s.keyword}"? The leads it found stay in your pool.`
                              }
                              onConfirm={() => onDelete(s.jobId, s.keyword)}
                              isLoading={isDeleting}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                title={isActive ? "Cancel & delete" : "Delete"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DeleteConfirmDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
