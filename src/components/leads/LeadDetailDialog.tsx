import React, { useState } from "react";
import {
  Loader2,
  ExternalLink,
  Mail,
  FileDown,
  RefreshCw,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScoreBadge } from "./ScoreBadge";
import { IssueBadges } from "./IssueBadges";
import { EmailDraftDialog } from "./EmailDraftDialog";
import { formatMs, formatMb } from "./auditMeta";
import { useGetLeadQuery } from "@/store/api/leadsApi";
import { useReauditLeadMutation } from "@/store/api/auditApi";
import { useDownloadAuditPdf } from "@/store/hooks/useDownloadAuditPdf";

interface LeadDetailDialogProps {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg border border-border p-2.5">
    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
    <div className="text-sm font-semibold tabular-nums">{value}</div>
  </div>
);

export const LeadDetailDialog: React.FC<LeadDetailDialogProps> = ({
  leadId,
  open,
  onOpenChange,
}) => {
  const { data, isFetching } = useGetLeadQuery(leadId as string, {
    skip: !open || !leadId,
  });
  const [reaudit, { isLoading: isReauditing }] = useReauditLeadMutation();
  const { download, isDownloading } = useDownloadAuditPdf();
  const [emailOpen, setEmailOpen] = useState(false);

  const lead = data?.data;
  const snippets = data?.snippets || lead?.snippets || [];
  const m = lead?.audit?.metrics;

  const onReaudit = async () => {
    if (!lead) return;
    try {
      await reaudit({ leadId: lead._id }).unwrap();
      toast.success("Re-audit started.");
    } catch (err: any) {
      if (err?.status === 402) toast.error("Not enough credits to re-audit.");
      else toast.error("Could not start the re-audit.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {isFetching && !lead ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : lead ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between gap-4 pr-6">
                  <span className="truncate">{lead.businessName}</span>
                  <ScoreBadge score={lead.audit?.score} />
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {(lead.city || lead.state) && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {[lead.city, lead.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {lead.website && (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      {lead.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {lead.audit?.niche && (
                    <span className="capitalize">{lead.audit.niche.replace(/-/g, " ")}</span>
                  )}
                </div>

                {/* Metrics */}
                {m && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {m.perfScore != null && <Metric label="Performance" value={`${m.perfScore}/100`} />}
                    {m.seoScore != null && <Metric label="SEO" value={`${m.seoScore}/100`} />}
                    {m.accessibilityScore != null && <Metric label="Accessibility" value={`${m.accessibilityScore}/100`} />}
                    {m.lcpMs != null && <Metric label="LCP" value={formatMs(m.lcpMs)} />}
                    {m.fcpMs != null && <Metric label="FCP" value={formatMs(m.fcpMs)} />}
                    {m.totalBytes != null && <Metric label="Page size" value={formatMb(m.totalBytes)} />}
                  </div>
                )}

                {/* Issues */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Issues found</h4>
                  <IssueBadges issues={lead.audit?.issues} />
                </div>

                {/* Snippets */}
                {snippets.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Outreach talking points</h4>
                    <ul className="space-y-1.5">
                      {snippets.map((s, i) => (
                        <li key={`${s.code}-${i}`} className="text-sm text-muted-foreground">
                          • {s.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button onClick={() => setEmailOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" /> Draft email
                  </Button>
                  <Button variant="outline" onClick={onReaudit} disabled={isReauditing}>
                    {isReauditing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Re-audit
                  </Button>
                  {lead.auditJobId && (
                    <Button
                      variant="outline"
                      disabled={isDownloading}
                      onClick={() =>
                        download(lead.auditJobId as string, {
                          leadIds: [lead._id],
                          filename: `${lead.businessName}-audit.pdf`,
                        })
                      }
                    >
                      {isDownloading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileDown className="mr-2 h-4 w-4" />
                      )}
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {lead && (
        <EmailDraftDialog
          leadId={lead._id}
          businessName={lead.businessName}
          open={emailOpen}
          onOpenChange={setEmailOpen}
        />
      )}
    </>
  );
};
