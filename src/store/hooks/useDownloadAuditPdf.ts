import { useState } from "react";
import { toast } from "sonner";

/**
 * Downloads an audit report PDF (GET /audit/:auditJobId/pdf) with the auth
 * header and triggers a browser save. Kept as a hook so any view can reuse it.
 */
export const useDownloadAuditPdf = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async (
    auditJobId: string,
    opts: { leadIds?: string[]; aiSummary?: boolean; filename?: string } = {}
  ) => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem("authToken");
      const base = import.meta.env.VITE_API_BASE_URL;
      const qs = new URLSearchParams();
      if (opts.leadIds?.length) qs.set("leadIds", opts.leadIds.join(","));
      if (opts.aiSummary) qs.set("aiSummary", "true");
      const s = qs.toString();

      const res = await fetch(
        `${base}/audit/${auditJobId}/pdf${s ? `?${s}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = opts.filename || `audit-report-${auditJobId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not download the report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { download, isDownloading };
};
