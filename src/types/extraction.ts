export interface Extraction {
  id: string;
  date: string;
  location: string;
  category: string;
  recordsFound: number;
  status: "complete" | "in-progress" | "failed";
  progress?: number;
  downloadUrl?: string;
}

export interface ExtractionFilters {
  status?: string;
  category?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}
