import React from "react";
import { cn } from "@/lib/utils";
import { LeadIssue } from "@/store/api/types/audit";
import { issueLabel, severityClass, SEVERITY_ORDER } from "./auditMeta";

interface IssueBadgesProps {
  issues?: LeadIssue[];
  max?: number; // truncate with a "+N" pill
  className?: string;
}

/** Renders audit issues as severity-colored chips, worst first. */
export const IssueBadges: React.FC<IssueBadgesProps> = ({
  issues,
  max,
  className,
}) => {
  if (!issues?.length) {
    return <span className="text-xs text-muted-foreground">No issues</span>;
  }
  const sorted = [...issues].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );
  const shown = max ? sorted.slice(0, max) : sorted;
  const hidden = sorted.length - shown.length;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {shown.map((issue, i) => (
        <span
          key={`${issue.code}-${i}`}
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
            severityClass[issue.severity]
          )}
        >
          {issueLabel(issue.code)}
        </span>
      ))}
      {hidden > 0 && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          +{hidden}
        </span>
      )}
    </div>
  );
};
