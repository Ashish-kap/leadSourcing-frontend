// hooks/useScrape.ts

import { useState } from "react";
import {
  useScrapeJobPostMutation,
  useGetJobsQuery,
} from "../../store/api/scrapeJobApi";
import { handleApiError } from "../utils/errorHandling";
import { scrapeJobPostRequest } from "../../store/api/types/scrapeJob";
import { useNavigate } from "react-router-dom";

export const useScrapeJob = () => {
  const navigate = useNavigate();
  const [scrapeJobPostMutation, { isLoading: isScraping, error, data }] =
    useScrapeJobPostMutation();
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    error: jobsError,
    refetch: refetchJobs,
  } = useGetJobsQuery();
  const [jobId, setJobId] = useState<string | null>(null);
  const [scrapeStatus, setScrapeStatus] = useState<
    "idle" | "scraping" | "completed" | "failed"
  >("idle");

  const startScraping = async (scrapeData: scrapeJobPostRequest) => {
    try {
      setScrapeStatus("scraping");
      const result = await scrapeJobPostMutation(scrapeData).unwrap();
      setJobId(result.jobId);
      setScrapeStatus("completed");
      navigate("/");
      return result;
    } catch (error: any) {
      setScrapeStatus("failed");
      handleApiError(error);
      throw error;
    }
  };

  const resetScrapeJob = () => {
    setJobId(null);
    setScrapeStatus("idle");
  };

  const quickScrape = async (
    keyword: string,
    location: { countryCode: string; stateCode?: string; city?: string },
    options?: Partial<
      Omit<
        scrapeJobPostRequest,
        "keyword" | "countryCode" | "stateCode" | "city"
      >
    >
  ) => {
    const scrapeRequest: scrapeJobPostRequest = {
      keyword,
      countryCode: location.countryCode,
      stateCode: location.stateCode,
      city: location.city,
      maxRecords: options?.maxRecords ?? 100,
      reviewTimeRange: options?.reviewTimeRange ?? null,
      ratingFilter: options?.ratingFilter ?? undefined,
      reviewsWithinLastYears: options?.reviewsWithinLastYears ?? null,
    };
    return startScraping(scrapeRequest);
  };

  return {
    // Scraping mutation
    startScraping,
    quickScrape,
    resetScrapeJob,
    isScraping,
    scrapeStatus,
    jobId,
    error,
    data,

    // Jobs query
    jobs: jobsData?.jobs ?? [],
    pagination: jobsData?.pagination,
    isLoadingJobs,
    jobsError,
    refetchJobs,

    // Computed states
    canStartNewScrape: !isScraping && scrapeStatus !== "scraping",
    hasCompletedScrape: scrapeStatus === "completed" && !!jobId,
    hasFailed: scrapeStatus === "failed",
  };
};
