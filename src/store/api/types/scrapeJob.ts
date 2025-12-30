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
  onlyWithoutWebsite?: boolean;
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
  startedAt: string;
  completedAt: string | null;
  duration: {
    raw: number;
    seconds: number;
    formatted: string;
  };
}

export interface GetJobsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  sort?: string;
}

export interface GetJobsResponse {
  status: "success" | "error";
  results: number;
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: Job[];
}
