import { Severity } from "@/store/api/types/audit";

// Human-readable labels for issue codes (mirrors backend rubrics/snippets).
export const ISSUE_LABELS: Record<string, string> = {
  no_website: "No website",
  site_down: "Website down",
  no_ssl: "Not secure (no HTTPS)",
  not_mobile: "Not mobile-friendly",
  slow_load: "Slow to load",
  poor_lcp: "Slow main content (LCP)",
  heavy_page: "Heavy page",
  poor_seo: "Weak SEO",
  poor_accessibility: "Accessibility issues",
  no_schema: "No structured data",
  no_cta: "No call-to-action",
  no_contact_method: "No contact method",
  no_online_order: "No online ordering",
  no_menu: "No menu",
  no_reservations: "No reservations",
  no_emergency_service: "No emergency service",
  no_booking: "No service/quote request",
  no_online_booking: "No online booking",
  no_insurance_info: "No insurance info",
};

export const issueLabel = (code: string) => ISSUE_LABELS[code] || code;

// Lower score = more problems = stronger prospect → redder.
export const scoreColorClass = (score: number | null | undefined): string => {
  if (score == null) return "border-muted-foreground/40 text-muted-foreground";
  if (score < 50) return "border-destructive text-destructive";
  if (score < 80) return "border-amber-500 text-amber-600";
  return "border-emerald-500 text-emerald-600";
};

export const severityClass: Record<Severity, string> = {
  high: "bg-destructive/10 text-destructive border border-destructive/30",
  medium: "bg-amber-500/10 text-amber-600 border border-amber-500/30",
  low: "bg-muted text-muted-foreground border border-border",
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

// Formats a metric value pulled from lead.audit.metrics for display.
export const formatMs = (ms?: number) =>
  ms == null ? "—" : `${(ms / 1000).toFixed(1)}s`;
export const formatMb = (bytes?: number) =>
  bytes == null ? "—" : `${(bytes / 1e6).toFixed(1)} MB`;
