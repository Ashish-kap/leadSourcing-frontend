import { useState } from "react";
import { toast } from "sonner";

/**
 * Downloads filtered leads as CSV (GET /leads/export) with the auth header and
 * triggers a browser save. Accepts the same query params as the leads list.
 */
export const useExportLeads = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportLeads = async (
    params: Record<string, string | undefined> = {},
    filename = `leads-${Date.now()}.csv`
  ) => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem("authToken");
      const base = import.meta.env.VITE_API_BASE_URL;
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) qs.set(k, v);
      });
      const s = qs.toString();

      const res = await fetch(`${base}/leads/export${s ? `?${s}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not export leads. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return { exportLeads, isExporting };
};
