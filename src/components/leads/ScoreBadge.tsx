import React from "react";
import { cn } from "@/lib/utils";
import { scoreColorClass } from "./auditMeta";

interface ScoreBadgeProps {
  score: number | null | undefined;
  size?: "sm" | "md";
  className?: string;
}

/** Circular audit score badge, colored by severity (low score = red prospect). */
export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  size = "md",
  className,
}) => (
  <span
    className={cn(
      "inline-flex items-center justify-center rounded-full border-2 font-bold tabular-nums",
      size === "sm" ? "h-8 w-8 text-xs" : "h-11 w-11 text-sm",
      scoreColorClass(score),
      className
    )}
    title={score == null ? "Not audited" : `Website score ${score}/100`}
  >
    {score == null ? "—" : score}
  </span>
);
