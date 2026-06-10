// Shared types for the v2 audit + leads feature. Mirrors the backend
// (v2/models/leadModel.js, auditJobModel.js) response shapes.

export type Severity = "high" | "medium" | "low";
export type AuditStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";
export type PipelineStatus = "new" | "contacted" | "replied" | "won" | "lost";
export type AuditMode = "http" | "full";

export interface LeadIssue {
  code: string;
  severity: Severity;
  value?: unknown;
}

export interface LeadCheck {
  auditJobId: string;
  code: string;
  phase: "http" | "browser";
  passed: boolean;
  severity?: Severity;
  value?: unknown;
  ranAt?: string;
  error?: string;
}

export interface LeadMetrics {
  loadTimeMs?: number;
  fcpMs?: number;
  lcpMs?: number;
  pageSize?: number;
  requestCount?: number;
  speedIndexMs?: number;
  tbtMs?: number;
  cls?: number;
  totalBytes?: number;
  perfScore?: number;
  seoScore?: number;
  accessibilityScore?: number;
  bestPracticesScore?: number;
}

export interface LeadAudit {
  status: AuditStatus;
  phase?: string;
  niche?: string;
  audit_version?: number;
  audited_at?: string;
  checks?: LeadCheck[];
  score: number | null;
  issues: LeadIssue[];
  metrics?: LeadMetrics;
  error?: { message?: string; code?: string; timestamp?: string };
}

export interface LeadPipeline {
  status: PipelineStatus;
  notes?: string;
  tags?: string[];
  pinned?: boolean;
  contactedAt?: string;
  updatedAt?: string;
}

export interface EmailSnippet {
  code: string;
  severity: Severity;
  text: string;
}

export interface Lead {
  _id: string;
  userId: string;
  jobIds?: string[];
  lastJobId?: string | null;
  auditJobId?: string | null;
  businessName: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  googleMapsUrl?: string;
  category?: string;
  audit: LeadAudit;
  pipeline: LeadPipeline;
  snippets?: EmailSnippet[];
  createdAt: string;
  updatedAt: string;
}

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  jobId?: string;
  niche?: string;
  minScore?: number;
  maxScore?: number;
  issues?: string; // csv of issue codes
  pipelineStatus?: PipelineStatus;
  pinned?: boolean;
  search?: string;
  sort?: string;
  snippets?: boolean;
}

export interface GetLeadsResponse {
  status: string;
  results: number;
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: Lead[];
}

export interface GetLeadResponse {
  status: string;
  data: Lead;
  snippets: EmailSnippet[];
}

export interface UpdatePipelinePayload {
  leadId: string;
  status?: PipelineStatus;
  notes?: string;
  tags?: string[];
  pinned?: boolean;
}

export interface BulkUpdatePayload {
  leadIds: string[];
  pipeline: { status?: PipelineStatus; pinned?: boolean };
}

export interface EmailDraft {
  subject: string;
  body: string;
  source: "ai" | "template";
}

export interface DraftEmailResponse {
  status: string;
  data: EmailDraft;
}

// ── Audit jobs ──────────────────────────────────────────────────────────────
export interface NicheOption {
  slug: string;
  label: string;
}

export interface AuditJobProgress {
  total: number;
  completed: number;
  failed: number;
  percentage: number;
}

export interface AuditJobSummary {
  avgScore: number | null;
  highSeverityCount: number;
  issueBreakdown: Record<string, number>;
}

export interface AuditJob {
  _id: string;
  auditJobId: string;
  userId: string;
  sourceJobId: string;
  niche: string;
  status: "waiting" | "active" | "completed" | "failed" | "cancelled";
  startedAt?: string;
  completedAt?: string;
  progress: AuditJobProgress;
  summary?: AuditJobSummary;
  creditsHeld?: number;
  creditsUsed?: number;
  creditsRefunded?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StartAuditPayload {
  // Omit for a cross-search selection — leadIds then defines the scope.
  sourceJobId?: string;
  niche?: string;
  leadIds?: string[];
  mode?: AuditMode;
}

export interface StartAuditResponse {
  status: string;
  auditJobId: string;
  totalLeads: number;
  estimatedUnits: number;
  mode: AuditMode;
}

export interface GetAuditJobResponse {
  status: string;
  data: AuditJob;
}

// ── v2 lead searches (scrape jobs surfaced as "Find Leads" rows) ─────────────
export interface StartSearchPayload {
  keyword: string;
  city?: string;
  stateCode?: string;
  countryCode: string;
  maxRecords?: number;
  avoidDuplicate?: boolean;
}

export interface StartSearchResponse {
  status: string;
  jobId: string;
  message: string;
}

export interface LeadSearchRow {
  jobId: string;
  keyword: string;
  location: string;
  status: string;
  progress: number;
  leadsFound: number;
  maxRecords?: number;
  createdAt: string;
  completedAt?: string | null;
}

export interface GetSearchesResponse {
  status: string;
  results: number;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: LeadSearchRow[];
}
