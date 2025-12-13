export interface scrapeJobPostRequest {
  keyword: string;
  countryCode: string;
  stateCode?: string;
  city?: string;
  maxRecords: number | null;
  reviewTimeRange?: number | null;
  ratingFilter?: {
    operator: "gt" | "lt" | "gte" | "lte";
    value: number;
  };
  reviewFilter?: {
    operator: "gt" | "lt" | "gte" | "lte";
    value: number;
  };
  reviewsWithinLastYears?: number | null;
  isExtractEmail?: boolean;
  isValidate?: boolean;
  avoidDuplicate?: boolean;
  extractNegativeReviews?: boolean;
}

export interface scrapeJobPostResponse {
  jobId: string;
  message: string;
}

//  Get api job

export interface Job {
  id: string;
  keyword: string;
  location: string;
  status: string;
  progress: number;
  maxRecords: number;
  recordsCollected?: number;
  createdAt: string;
  completedAt: string | null;
  duration: number | null;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetJobsResponse {
  success: boolean;
  data: {
    jobs: Job[];
    pagination: Pagination;
  };
}
