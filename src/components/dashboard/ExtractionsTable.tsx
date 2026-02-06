import React, { useState, useMemo, useEffect } from "react";
import io from "socket.io-client";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Download,
  // Eye,
  // MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  // Clock,
  Trash2,
  // Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/service/analytics";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDownloadCsv } from "@/store/hooks/useDownloadCsv";
import {
  useGetJobsQuery,
  useDeleteJobMutation,
} from "@/store/api/scrapeJobApi";
import { useGetCurrentUserQuery } from "@/store/api/authApi";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { Country, State } from "country-state-city";

interface Extraction {
  id: string;
  keyword: string;
  location: string;
  status: string;
  progress: number;
  maxRecords: number;
  recordsCollected?: number;
  createdAt: string;
  startedAt: string;
  completedAt: string | null;
  duration: {
    raw: number;
    seconds: number;
    formatted: string;
  };
}

const statusColors: Record<string, string> = {
  completed: "bg-success text-success-foreground",
  active: "bg-warning text-warning-foreground",
  failed: "bg-destructive text-destructive-foreground",
  waiting: "bg-warning text-warning-foreground",
  delayed: "bg-warning text-warning-foreground",
  pause: "bg-warning text-warning-foreground",
  data_not_found: "bg-muted text-muted-foreground",
};

function locationToFilenamePart(locationStr: string): string {
  const toReadable = (s: string) =>
    (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const raw = (locationStr || "").trim();
  if (!raw) return "(unknown)";
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  const countryCodeForLookup = (code: string) =>
    code.toUpperCase() === "UK" ? "GB" : code.toUpperCase();
  if (parts.length >= 3) {
    const countryCodeRaw = parts[parts.length - 1];
    const stateCodeRaw = parts[parts.length - 2];
    const countryCode = countryCodeForLookup(countryCodeRaw);
    const stateCode = stateCodeRaw.toUpperCase();
    const city = parts.slice(0, -2).join(" ");
    const country = Country.getCountryByCode(countryCode);
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    const cityReadable = toReadable(city);
    const stateReadable = state?.name
      ? toReadable(state.name)
      : toReadable(stateCodeRaw);
    const countryReadable = country?.name
      ? toReadable(country.name)
      : toReadable(countryCodeRaw);
    return `(${cityReadable}, ${stateReadable}, ${countryReadable})`;
  }
  if (parts.length === 2) {
    const countryCodeRaw = parts[1];
    const countryCode = countryCodeForLookup(countryCodeRaw);
    const country = Country.getCountryByCode(countryCode);
    const state = State.getStateByCodeAndCountry(
      parts[0].toUpperCase(),
      countryCode
    );
    const stateOrCityReadable = state?.name
      ? toReadable(state.name)
      : toReadable(parts[0]);
    const countryReadable = country?.name
      ? toReadable(country.name)
      : toReadable(countryCodeRaw);
    return `(${stateOrCityReadable}, ${countryReadable})`;
  }
  const countryCode = countryCodeForLookup(parts[0]);
  const country = Country.getCountryByCode(countryCode);
  const countryReadable = country?.name
    ? toReadable(country.name)
    : toReadable(parts[0]);
  return `(${countryReadable})`;
}

function buildDownloadFileName(
  extraction: Pick<
    Extraction,
    "keyword" | "location" | "createdAt" | "completedAt"
  >
): string {
  const sanitize = (s: string) =>
    (s || "")
      .toLowerCase()
      .replace(/[\s,\/]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  const keyword = sanitize(extraction.keyword);
  const location = locationToFilenamePart(extraction.location);
  const dateStr = extraction.completedAt
    ? new Date(extraction.completedAt).toISOString().slice(0, 10)
    : new Date(extraction.createdAt).toISOString().slice(0, 10);
  return `${keyword}-${location}-${dateStr}.csv`;
}

export const ExtractionsTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [, setIsMobile] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeProgress, setRealtimeProgress] = useState<
    Record<string, number>
  >({});
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [, setSelectedJobForFeedback] = useState<{
    id: string;
    keyword: string;
  } | null>(null);
  const navigate = useNavigate();

  const sort = "-createdAt"; // Default sort

  const {
    data: jobsData,
    refetch: refetchJobs,
  } = useGetJobsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: statusFilter === "all" ? undefined : statusFilter,
    keyword: query || undefined,
    sort,
  });

  const { refetch: refetchUser } = useGetCurrentUserQuery();

  const [deleteJob, { isLoading: isDeletingJob }] = useDeleteJobMutation();

  const pageInfo = jobsData || {
    data: [],
    page: 1,
    limit: pagination.pageSize,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // FIXED: Proper Socket.IO connection management
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // No token found for Socket.IO connection
      return;
    }

    const newSocket = io(import.meta.env.VITE_BACKEND_HOST, {
      auth: { token },
      autoConnect: true,
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("connect_error", () => {
      // Socket.IO connection error
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Job event handlers
    newSocket.on("job_update", (data) => {
      if (data.type === "job_completed") {
        // Clean up real-time progress for completed job
        setRealtimeProgress((prev) => {
          const updated = { ...prev };
          delete updated[data.job.jobId];
          return updated;
        });
        // Refetch jobs data to update the table
        refetchJobs();
        // Refetch user data to update credits/usage
        refetchUser();
      } else if (data.type === "job_no_data_found") {
        // Clean up real-time progress for completed job
        setRealtimeProgress((prev) => {
          const updated = { ...prev };
          delete updated[data.job.jobId];
          return updated;
        });
        // Refetch jobs data to update the table
        refetchJobs();
        // Refetch user data to update credits/usage
        refetchUser();
      } else if (data.type === "job_failed") {
        // Clean up real-time progress for failed job
        setRealtimeProgress((prev) => {
          const updated = { ...prev };
          delete updated[data.job.jobId];
          return updated;
        });
        refetchJobs();
        // Refetch user data to update credits/usage
        refetchUser();
      } else if (data.type === "job_started") {
        refetchJobs();
      }else if (data.type === "job_deleted") {
        refetchJobs();
        // Refetch user data to update credits/usage
        refetchUser();
      }
    });

    newSocket.on("job_progress", (data) => {
      // Update real-time progress state
      setRealtimeProgress((prev) => ({
        ...prev,
        [data.jobId]: data.progress.percentage,
      }));
    });

    newSocket.on("active_jobs_status", () => {
      // Handle active jobs status if needed
    });

    // IMPORTANT: Cleanup function
    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
      setIsConnected(false);
    };
  }, [refetchJobs, refetchUser]);

  // handle mobile layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // extract job list or empty
  const data: Extraction[] = useMemo(() => pageInfo.data ?? [], [pageInfo]);

  const handleDeleteJob = async (jobId: string, jobKeyword: string) => {
    try {
      await deleteJob(jobId).unwrap();
      toast.success(`Successfully deleted extraction for "${jobKeyword}"`);
    } catch (error: any) {
      // Delete job error
      toast.error("Failed to delete extraction. Please try again.");
    }
  };

  const handleDownloadWithFeedback = (jobId: string, keyword: string) => {
    // Set the selected job for feedback
    setSelectedJobForFeedback({ id: jobId, keyword });
    // Open the feedback modal
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackUpgrade = () => {
    // Navigate to subscription page
    navigate("/subscription");
    // Close the feedback modal
    setIsFeedbackModalOpen(false);
    setSelectedJobForFeedback(null);
  };

  const columns = useMemo<ColumnDef<Extraction>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ getValue }) => (
          <div className="min-w-[100px]">
            {new Date(getValue<string>()).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ getValue }) => (
          <div className="min-w-[120px] max-w-[200px] truncate">
            {String(getValue())}
          </div>
        ),
      },
      {
        accessorKey: "keyword",
        header: "Keyword",
      },
      {
        accessorKey: "progress",
        header: "Progress",
        cell: ({ getValue, row }) => {
          const jobId = row.original.id;
          const status = row.original.status;
          const maxRecords = row.original.maxRecords;
          const recordsCollected = row.original.recordsCollected ?? 0;
          const originalProgress = getValue<number>();
          const isActive = status === "active";

          // Calculate progress based on job status
          let displayProgress: number;
          let recordsDisplay: string;

          if (status === "active") {
            // For active jobs, use real-time progress from socket or API
            displayProgress = realtimeProgress[jobId] ?? originalProgress ?? 0;
            const estimatedRecords = maxRecords
              ? Math.floor((displayProgress / 100) * maxRecords)
              : 0;
            recordsDisplay = maxRecords
              ? `${estimatedRecords}/${maxRecords}`
              : "Processing...";
          } else {
            // For completed/failed jobs, calculate based on actual records collected
            if (maxRecords && maxRecords > 0) {
              displayProgress = Math.min(
                (recordsCollected / maxRecords) * 100,
                100
              );
              recordsDisplay = `${recordsCollected}/${maxRecords}`;
            } else {
              displayProgress = recordsCollected > 0 ? 100 : 0;
              recordsDisplay = `${recordsCollected}`;
            }
          }

          return (
            <div className="min-w-[120px] space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress
                    value={displayProgress}
                    className={`h-2 ${
                      status === "failed" || status === "data_not_found"
                        ? "bg-destructive/20"
                        : ""
                    }`}
                  />
                </div>
                {isActive && (
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                )}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{recordsDisplay}</span>
                <span
                  className={
                    (status === "failed" && recordsCollected === 0) ||
                    status === "data_not_found"
                      ? "text-destructive"
                      : ""
                  }
                >
                  {Math.round(displayProgress)}%
                </span>
              </div>
            </div>
          );
        },
      },
      // {
      //   accessorKey: "estimatedTime",
      //   header: "Est. Completion",
      //   cell: ({ row }) => {
      //     const jobId = row.original.id;
      //     const status = row.original.status;
      //     const maxRecords = row.original.maxRecords;
      //     const createdAt = row.original.createdAt;
      //     const originalProgress = row.original.progress;

      //     // Use real-time progress if available, otherwise use original progress
      //     const currentProgress =
      //       realtimeProgress[jobId] ?? originalProgress ?? 0;

      //     const { estimatedTime, remainingTime } = calculateEstimatedTime(
      //       currentProgress,
      //       maxRecords,
      //       createdAt,
      //       status
      //     );

      //     // Validate maxRecords for display
      //     // const validMaxRecords =
      //     //   maxRecords && !isNaN(maxRecords) && maxRecords > 0
      //     //     ? maxRecords
      //     //     : null;
      //     // const validProgress =
      //     //   !isNaN(currentProgress) && currentProgress >= 0
      //     //     ? currentProgress
      //     //     : 0;
      //     // const recordsProcessed = validMaxRecords
      //     //   ? Math.floor((validProgress / 100) * validMaxRecords)
      //     //   : 0;

      //     return (
      //       <div className="min-w-[140px] space-y-1">
      //         {/* <div className="text-xs text-muted-foreground">
      //           {validMaxRecords
      //             ? `${recordsProcessed}/${validMaxRecords} records`
      //             : "Processing..."}
      //         </div> */}
      //         <div className="flex items-center gap-1">
      //           <Clock className="h-3 w-3 text-muted-foreground" />
      //           <div className="text-sm font-medium">
      //             {status === "active" ? remainingTime : null}
      //           </div>
      //         </div>
      //         {status === "active" && (
      //           <div className="text-xs text-muted-foreground">remaining</div>
      //         )}
      //         {/* {status === "completed" && (
      //           <div className="text-xs text-green-600">Done</div>
      //         )} */}
      //       </div>
      //     );
      //   },
      // },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = String(getValue());
          return (
            <div className="min-w-[100px]">
              <Badge className={statusColors[status] || ""}>
                {status === "data_not_found"
                  ? "Data not found"
                  : status
                      .replace("-", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const extraction = row.original;
          const { downloadCsv, isDownloading } = useDownloadCsv();
          return (
            <div className="flex items-center space-x-1 min-w-[120px]">
              {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button> */}
              {extraction.status === "completed" &&
                (extraction.recordsCollected ?? 0) > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      trackEvent("download_csv", {
                        job_id: row.original.id,
                        records: row.original.recordsCollected ?? 0,
                      });
                      // First download the CSV
                      downloadCsv(
                        row.original.id,
                        buildDownloadFileName(row.original)
                      );
                      // Then open feedback modal
                      handleDownloadWithFeedback(
                        row.original.id,
                        row.original.keyword
                      );
                    }}
                    disabled={isDownloading}
                    className="cursor-pointer"
                  >
                    <Download
                      className={`h-4 w-4 ${
                        isDownloading ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                )}
              <DeleteConfirmDialog
                description={`This action cannot be undone. This will permanently delete the extraction for "${extraction.keyword}" and remove all associated data.`}
                onConfirm={() => {
                  trackEvent("delete_job", { job_id: row.original.id });
                  handleDeleteJob(row.original.id, row.original.keyword);
                }}
                isLoading={isDeletingJob}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeletingJob}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 cursor-pointer"
                >
                  {isDeletingJob ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </DeleteConfirmDialog>
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  {extraction.status === "completed" && 
                   (extraction.recordsCollected ?? 0) > 0 && (
                    <>
                      <DropdownMenuItem>Download CSV</DropdownMenuItem>
                      <DropdownMenuItem>Download Excel</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          );
        },
      },
    ],
    [
      realtimeProgress,
      handleDeleteJob,
      isDeletingJob,
      handleDownloadWithFeedback,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: query,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setQuery,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pageInfo.totalPages,
    rowCount: pageInfo.total,
  });

  const connectionStatus = isConnected ? (
    <div className="text-green-600 text-xs mb-2">
      🟢 Real-time updates connected
    </div>
  ) : (
    <div className="text-red-600 text-xs mb-2">
      🔴 Real-time updates disconnected
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="pb-4">Recent Extractions</CardTitle>
          {connectionStatus}
          <div className="flex flex-col sm:flex-row justify-between gap-4  sm:items-center">
            {/* LEFT: Search & Select grouped */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search extractions..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    table.setPageIndex(0);
                  }}
                  className="pl-10 w-full"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  table.setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="data_not_found">No Data Found</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* RIGHT: Button */}
            <Button
              onClick={() => navigate("/extraction")}
              className="whitespace-nowrap cursor-pointer bg-primary/90 text-primary-foreground shadow-glow"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">
                New Google Maps Extraction
              </span>
              <span className="sm:hidden">New Extraction</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="bg-muted/50 whitespace-nowrap"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="whitespace-nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                pageInfo.total || 0
              )}{" "}
              of {pageInfo.total || 0} results
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                  table.setPageIndex(0);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 15, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedJobForFeedback(null);
        }}
        onUpgrade={handleFeedbackUpgrade}
      />
    </>
  );
};
