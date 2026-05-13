import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMaintenanceStatus } from "@/utils/maintenance";

function getDismissalKey(
  status: string,
  startAt: Date | null,
  endAt: Date | null
) {
  if (!startAt || !endAt) return "";

  return `maintenance-banner-dismissed:${status}:${startAt.toISOString()}:${endAt.toISOString()}`;
}

export function MaintenanceTopBanner() {
  const maintenance = useMaintenanceStatus();
  const dismissalKey = useMemo(
    () =>
      getDismissalKey(
        maintenance.status,
        maintenance.startAt,
        maintenance.endAt
      ),
    [maintenance.endAt, maintenance.startAt, maintenance.status]
  );
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!maintenance.isVisible || !dismissalKey) {
      setIsDismissed(false);
      return;
    }

    setIsDismissed(localStorage.getItem(dismissalKey) === "true");
  }, [dismissalKey, maintenance.isVisible]);

  if (!maintenance.isVisible || isDismissed) return null;

  const message = maintenance.isActive
    ? `Maintenance is in progress until ${maintenance.localEndTimeLabel}. Services may be temporarily impacted during this window.`
    : `Scheduled maintenance is planned for ${maintenance.localDateLabel}, from ${maintenance.localTimeRangeLabel}. Services may be temporarily impacted during this window.`;
  const indiaReference = maintenance.isActive
    ? `IST: until ${maintenance.indiaEndTimeLabel}.`
    : `IST: ${maintenance.indiaTimeRangeLabel}.`;

  const handleDismiss = () => {
    if (dismissalKey) {
      localStorage.setItem(dismissalKey, "true");
    }
    setIsDismissed(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "sticky top-0 z-50 border-b px-3 py-2 text-sm shadow-sm",
        maintenance.isActive
          ? "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/25 dark:text-red-100"
          : "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-100"
      )}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-8">
        <div className="flex min-w-0 max-w-full items-center justify-center gap-2">
          {maintenance.isActive ? (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          ) : (
            <CalendarClock className="h-4 w-4 shrink-0" />
          )}
          <p className="min-w-0 truncate text-center">
            {message}
            {maintenance.shouldShowIndiaTimeReference && (
              <span className="hidden sm:inline"> {indiaReference}</span>
            )}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleDismiss}
          aria-label="Dismiss maintenance notice"
          className={cn(
            "cursor-pointer absolute right-0 h-6 w-6 shrink-0 hover:bg-black/5 dark:hover:bg-white/10",
            maintenance.isActive
              ? "text-red-950 hover:text-red-950 dark:text-red-100"
              : "text-amber-950 hover:text-amber-950 dark:text-amber-100"
          )}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
