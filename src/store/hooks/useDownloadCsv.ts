// hooks/useDownloadCsv.ts

import { useLazyDownloadJobCsvQuery } from "@/store/api/scrapeJobApi";

export function useDownloadCsv() {
  const [triggerDownload, { isFetching }] = useLazyDownloadJobCsvQuery();

  const downloadCsv = async (jobId: string, fileName: string) => {
    try {
      const blob = await triggerDownload(jobId).unwrap();

      // Create a URL for the blob and trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // You can add further error handling here if desired
    }
  };

  return {
    downloadCsv,
    isDownloading: isFetching,
  };
}
