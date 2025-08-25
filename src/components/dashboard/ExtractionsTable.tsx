import React, { useState, useMemo, useEffect } from "react";
import io from "socket.io-client";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
  // Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useGetJobsQuery } from "@/store/api/scrapeJobApi";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface Extraction {
  id: string;
  keyword: string;
  location: string;
  status: string;
  progress: number;
  createdAt: string;
  completedAt: string | null;
  duration: number | null;
}

const statusColors: Record<string, string> = {
  completed: "bg-success text-success-foreground",
  active: "bg-warning text-warning-foreground",
  failed: "bg-destructive text-destructive-foreground",
  waiting: "bg-warning text-warning-foreground",
  delayed: "bg-warning text-warning-foreground",
  pause: "bg-warning text-warning-foreground",
};

export const ExtractionsTable: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeProgress, setRealtimeProgress] = useState<
    Record<string, number>
  >({});
  const navigate = useNavigate();

  const {
    data: jobsData,
    refetch: refetchJobs, // ADD: refetch function
  } = useGetJobsQuery();

  // FIXED: Proper Socket.IO connection management
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("No token found for Socket.IO connection");
      return;
    }

    console.log("🔌 Initializing Socket.IO connection...");

    const newSocket = io(
      import.meta.env.VITE_BACKEND_HOST || "http://localhost:3000",
      {
        auth: { token },
        autoConnect: true,
      }
    );

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("✅ Socket.IO connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket.IO disconnected:", reason);
      setIsConnected(false);
    });

    // Job event handlers
    newSocket.on("job_update", (data) => {
      console.log("🔄 Job update received:", data);

      if (data.type === "job_completed") {
        console.log(
          `✅ Job completed with ${data.job.totalExtractions || 0} extractions!`
        );
        // Clean up real-time progress for completed job
        setRealtimeProgress((prev) => {
          const updated = { ...prev };
          delete updated[data.job.jobId];
          return updated;
        });
        // Refetch jobs data to update the table
        refetchJobs();
      } else if (data.type === "job_failed") {
        console.log(`❌ Job failed: ${data.job.error?.message}`);
        // Clean up real-time progress for failed job
        setRealtimeProgress((prev) => {
          const updated = { ...prev };
          delete updated[data.job.jobId];
          return updated;
        });
        refetchJobs();
      } else if (data.type === "job_started") {
        console.log(`🚀 Job started: ${data.job.jobId}`);
        refetchJobs();
      }
    });

    newSocket.on("job_progress", (data) => {
      console.log(
        `📈 Job progress: ${data.jobId} - ${data.progress.percentage}%`
      );

      // Update real-time progress state
      setRealtimeProgress((prev) => ({
        ...prev,
        [data.jobId]: data.progress.percentage,
      }));
    });

    newSocket.on("active_jobs_status", (data) => {
      console.log("📊 Active jobs status:", data);
      // Handle active jobs status if needed
    });

    // IMPORTANT: Cleanup function
    return () => {
      console.log("🧹 Cleaning up Socket.IO connection...");
      newSocket.removeAllListeners();
      newSocket.disconnect();
      setIsConnected(false);
    };
  }, []);

  // handle mobile layout
  useEffect(() => {
    console.log(isMobile);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // extract job list or empty
  const data: Extraction[] = useMemo(() => jobsData?.jobs ?? [], [jobsData]);

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
          const originalProgress = getValue<number>();

          // Use real-time progress if available, otherwise use original progress
          const currentProgress = realtimeProgress[jobId] ?? originalProgress;
          const isActive = status === "active";

          return (
            <div className="min-w-[120px] space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress value={currentProgress} className="h-2" />
                </div>
                {isActive && (
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                )}
              </div>
              <div className="text-xs text-right text-muted-foreground">
                {Math.round(currentProgress)}%
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = String(getValue());
          return (
            <div className="min-w-[100px]">
              <Badge className={statusColors[status] || ""}>
                {status
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
              {extraction.progress === 100 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    downloadCsv(
                      row.original.id,
                      `${row.original.keyword}-extraction.csv`
                    )
                  }
                  disabled={isDownloading}
                >
                  <Download
                    className={`h-4 w-4 ${isDownloading ? "animate-spin" : ""}`}
                  />
                </Button>
              )}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  {extraction.progress === 100 && (
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
    [realtimeProgress]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
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
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) =>
                table
                  .getColumn("status")
                  ?.setFilterValue(value === "all" ? "" : value)
              }
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
              </SelectContent>
            </Select>
          </div>

          {/* RIGHT: Button */}
          <Button
            onClick={() => navigate("/extraction")}
            className="whitespace-nowrap cursor-pointer bg-primary/90 text-primary-foreground shadow-glow"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">New Google Maps Extraction</span>
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
                        <TableCell key={cell.id} className="whitespace-nowrap">
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
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex items-center space-x-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
