import React, { useState, useMemo, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useScrapeJob } from "../store/hooks/useScrape";
import { scrapeJobPostRequest } from "../store/api/types/scrapeJob";
import { useGetCurrentUserQuery } from "@/store/api/authApi";
import { toast } from "sonner";

// Shadcn/UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, RotateCcw, HelpCircle } from "lucide-react";
import { trackEvent } from "@/service/analytics";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { InfoAlertDialog } from "@/components/ui/info-alert-dialog";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface LocationState {
  countryCode: string;
  stateCode: string;
  city: string;
}

export const Extraction: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showExtractionGuideDialog, setShowExtractionGuideDialog] =
    useState(false);
  const { data: userData } = useGetCurrentUserQuery();
  const {
    startScraping,
    isScraping,
    jobId,
    scrapeStatus,
    hasCompletedScrape,
    hasFailed,
    resetScrapeJob,
  } = useScrapeJob();

  // Show extraction guide dialog on first visit
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("hasSeenExtractionGuide");
    if (!hasSeenGuide) {
      setShowExtractionGuideDialog(true);
      localStorage.setItem("hasSeenExtractionGuide", "true");
    }
  }, []);

  const [formData, setFormData] = useState({
    keyword: "",
    maxRecords: null as number | null,
    reviewTimeRange: null as number | null,
    ratingFilter: {
      operator: "gte" as "gt" | "lt" | "gte" | "lte",
      value: null as number | null,
    },
    reviewFilter: {
      operator: "lte" as "gt" | "lt" | "gte" | "lte",
      value: null as number | null,
    },
    reviewsWithinLastYears: null as number | null,
    isExtractEmail: true,
    isValidate: false,
    avoidDuplicate: false,
    extractNegativeReviews: false,
    onlyWithoutWebsite: false,
  });

  const [location, setLocation] = useState<LocationState>({
    countryCode: "",
    stateCode: "",
    city: "",
  });

  // Get all countries
  const countries = useMemo(() => {
    return Country.getAllCountries();
  }, []);

  // Get states for selected country
  const states = useMemo(() => {
    if (!location.countryCode) return [];
    return State.getStatesOfCountry(location.countryCode);
  }, [location.countryCode]);

  // // Get cities for selected state
  const cities = useMemo(() => {
    if (!location.countryCode || !location.stateCode) return [];
    return City.getCitiesOfState(location.countryCode, location.stateCode);
  }, [location.countryCode, location.stateCode]);

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
    [countries]
  );

  const stateOptions = useMemo(
    () =>
      states.map((state) => ({
        value: state.isoCode,
        label: state.name,
      })),
    [states]
  );

  const cityOptions = useMemo(
    () =>
      cities.map((city) => ({
        key: `${city.name}-${city.latitude}-${city.longitude}`,
        value: city.name,
        label: city.name,
        keywords: [city.stateCode, city.countryCode].filter(Boolean),
      })),
    [cities]
  );

  const handleCountryChange = (countryCode: string) => {
    setLocation({
      countryCode,
      stateCode: "",
      city: "",
    });
  };

  const handleStateChange = (stateCode: string) => {
    setLocation((prev) => ({
      ...prev,
      stateCode,
      city: "",
    }));
  };

  const handleCityChange = (city: string) => {
    setLocation((prev) => ({
      ...prev,
      city,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "ratingFilterValue") {
      setFormData((prev) => ({
        ...prev,
        ratingFilter: {
          ...prev.ratingFilter,
          value:
            value === "" || value === null || value === undefined
              ? null
              : isNaN(parseFloat(value))
              ? null
              : parseFloat(value),
        },
      }));
      return;
    }

    if (name === "reviewFilterValue") {
      setFormData((prev) => ({
        ...prev,
        reviewFilter: {
          ...prev.reviewFilter,
          value:
            value === "" || value === null || value === undefined
              ? null
              : isNaN(parseFloat(value))
              ? null
              : parseFloat(value),
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === "" || value === null || value === undefined
            ? null
            : isNaN(parseFloat(value))
            ? null
            : parseFloat(value)
          : value,
    }));
  };

  const handleEmailCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      isExtractEmail: checked === true,
      isValidate: checked === true ? prev.isValidate : false,
    }));
  };

  const handleValidateCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      isValidate: checked === true,
    }));
  };

  const handleAvoidDuplicateCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      avoidDuplicate: checked === true,
    }));
  };

  const handleExtractNegativeReviewsCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      extractNegativeReviews: checked === true,
    }));
  };

  const handleOnlyWithoutWebsiteCheckboxChange = (checked: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      onlyWithoutWebsite: checked === true,
      isExtractEmail: checked === true ? false : prev.isExtractEmail,
      isValidate: checked === true ? false : prev.isValidate,
    }));
  };

  const handleRatingOperatorChange = (
    operator: "gt" | "lt" | "gte" | "lte"
  ) => {
    setFormData((prev) => ({
      ...prev,
      ratingFilter: {
        ...prev.ratingFilter,
        operator,
      },
    }));
  };

  const handleReviewOperatorChange = (
    operator: "gt" | "lt" | "gte" | "lte"
  ) => {
    setFormData((prev) => ({
      ...prev,
      reviewFilter: {
        ...prev.reviewFilter,
        operator,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.keyword.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    if (!location.countryCode) {
      toast.error("Please select a country");
      return;
    }

    if (!formData.maxRecords || formData.maxRecords <= 0) {
      toast.error("Please enter the number of businesses to extract");
      return;
    }

    // Check plan limits for free users (fallback check)  -- tempory disable for 24hrs offer
    if (userData?.user.plan === "free" && formData.maxRecords > 50) {
      toast.error(
        "Free plans are limited to 50 records. Please upgrade to Business plan for more extractions."
      );
      return;
    }

    // Check if user has enough credits
    const remainingCredits = userData?.user.credits?.remaining;
    if (remainingCredits !== undefined && remainingCredits < formData.maxRecords) {
      toast.error(
        `Insufficient credits. You have ${remainingCredits} credits remaining, but need ${formData.maxRecords} credits for this extraction. Please upgrade your plan or reduce the number of records.`
      );
      return;
    }

    

    // Validate reviewTimeRange if provided
    if (
      formData.reviewTimeRange !== null &&
      (formData.reviewTimeRange < 0 || formData.reviewTimeRange > 10)
    ) {
      toast.error("Reviews time range must be between 0 and 10 years");
      return;
    }

    // if (!location.stateCode) {
    //   toast.error("Please select a state");
    //   return;
    // }

    // if (!location.city) {
    //   toast.error("Please select a city");
    //   return;
    // }

    const fullRequest: scrapeJobPostRequest = {
      keyword: formData.keyword.trim(),
      countryCode: location.countryCode,
      stateCode: location.stateCode,
      city: location.city,
      maxRecords: formData.maxRecords,
      reviewTimeRange: formData.reviewTimeRange,
      ratingFilter:
        formData.ratingFilter.value !== null
          ? {
              operator: formData.ratingFilter.operator,
              value: formData.ratingFilter.value,
            }
          : undefined,
      reviewFilter:
        formData.reviewFilter.value !== null
          ? {
              operator: formData.reviewFilter.operator,
              value: formData.reviewFilter.value,
            }
          : undefined,
      reviewsWithinLastYears: formData.reviewsWithinLastYears,
      isExtractEmail: formData.isExtractEmail,
      isValidate: formData.isValidate,
      avoidDuplicate: formData.avoidDuplicate,
      extractNegativeReviews: formData.extractNegativeReviews,
      onlyWithoutWebsite: formData.onlyWithoutWebsite,
    };

    const scrapeRequest = Object.fromEntries(
      Object.entries(fullRequest).filter(([key, value]) => {
        // Required string fields
        if (key === "keyword" || key === "countryCode") {
          return typeof value === "string" && value.trim() !== "";
        }

        // Optional string fields
        if (key === "stateCode" || key === "city") {
          return typeof value === "string" && value.trim() !== "";
        }

        // maxRecords is always numeric
        if (key === "maxRecords") {
          return typeof value === "number" && !isNaN(value);
        }

        // Optional numeric fields
        if (["reviewTimeRange", "reviewsWithinLastYears"].includes(key)) {
          return (
            value !== null && value !== undefined && !isNaN(value as number)
          );
        }

        // Rating filter object
        if (key === "ratingFilter") {
          return (
            value !== null &&
            value !== undefined &&
            typeof value === "object" &&
            value.operator &&
            value.value !== null &&
            !isNaN(value.value)
          );
        }

        // Review filter object
        if (key === "reviewFilter") {
          return (
            value !== null &&
            value !== undefined &&
            typeof value === "object" &&
            value.operator &&
            value.value !== null &&
            !isNaN(value.value)
          );
        }

        // Boolean fields
        if (key === "isExtractEmail" || key === "isValidate" || key === "avoidDuplicate" || key === "extractNegativeReviews" || key === "onlyWithoutWebsite") {
          return typeof value === "boolean";
        }

        return false;
      })
    ) as scrapeJobPostRequest;

    try {
      // Track event when user initiates scraping
      trackEvent("start_scrape", {
        keyword: formData.keyword.trim(),
        country: location.countryCode,
        state: location.stateCode || "(none)",
        city: location.city || "(none)",
        max_records: formData.maxRecords || 0,
        extract_email: formData.isExtractEmail,
        validate_data: formData.isValidate,
        avoid_duplicates: formData.avoidDuplicate,
        extract_negative_reviews: formData.extractNegativeReviews,
        only_without_website: formData.onlyWithoutWebsite,
      });

      const result = await startScraping(scrapeRequest);
      toast.success(`Scraping started! Job ID: ${result.jobId}`);
      // Set flag to show live data dialog on Dashboard
      localStorage.setItem("showLiveDataDialog", "true");
    } catch {
      // API error toasts are handled centrally via useScrapeJob -> handleApiError.
    }
  };

  const handleReset = () => {
    setFormData({
      keyword: "",
      maxRecords: null as number | null,
      reviewTimeRange: null,
      ratingFilter: {
        operator: "gte" as "gt" | "lt" | "gte" | "lte",
        value: null as number | null,
      },
      reviewFilter: {
        operator: "lte" as "gt" | "lt" | "gte" | "lte",
        value: null as number | null,
      },
      reviewsWithinLastYears: null,
      isExtractEmail: true,
      isValidate: false, // Always start as false since it depends on email extraction
      avoidDuplicate: false,
      extractNegativeReviews: false,
      onlyWithoutWebsite: false,
    });
    setLocation({
      countryCode: "",
      stateCode: "",
      city: "",
    });
    resetScrapeJob();
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-foreground">New Extraction</span>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Google Maps Scraper
                  </CardTitle>
                  <CardDescription>
                    Enter your search criteria to scrape business data from
                    Google Maps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Keyword Input */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="keyword">Search Keyword *</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Enter the type of business or service you want to
                              find (e.g., 'restaurants', 'hotels', 'coffee
                              shops')
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="keyword"
                        name="keyword"
                        value={formData.keyword}
                        onChange={handleInputChange}
                        placeholder="eg. restaurants"
                        required
                      />
                    </div>

                    {/* Location Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="country">Country *</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Select the country where you want to search for
                                businesses
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <SearchableSelect
                          id="country"
                          options={countryOptions}
                          value={location.countryCode}
                          onValueChange={handleCountryChange}
                          placeholder="Select country"
                          searchPlaceholder="Search countries..."
                        />
                      </div>

                      <div className="space-y-2 ">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Optional: Select a specific state or province to
                                narrow down your search
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <SearchableSelect
                          id="state"
                          options={stateOptions}
                          value={location.stateCode}
                          onValueChange={handleStateChange}
                          placeholder="Select state"
                          searchPlaceholder="Search states..."
                          disabled={!location.countryCode}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <SearchableSelect
                          id="city"
                          options={cityOptions}
                          value={location.city}
                          onValueChange={handleCityChange}
                          placeholder="Select city"
                          searchPlaceholder="Search cities..."
                          disabled={!location.stateCode}
                        />
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="maxRecords">
                            Number of businesses *
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Maximum number of business records to extract
                                (1-1000). Higher numbers take longer to process.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="maxRecords"
                          name="maxRecords"
                          type="number"
                          value={formData.maxRecords || ""}
                          onChange={handleInputChange}
                          placeholder="eg. 500"
                          min="1"
                          max="1000"
                          required
                        />
                      </div>

                       <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="reviewTimeRange">
                            Reviews Within Last (years)
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Optional: Only include businesses with reviews
                                posted within the last X years (0-10). Leave
                                empty for all reviews.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input
                          id="reviewTimeRange"
                          name="reviewTimeRange"
                          type="number"
                          value={formData.reviewTimeRange || ""}
                          onChange={handleInputChange}
                          min="0"
                          max="10"
                          placeholder="eg. 5"
                        />
                      </div> 

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="ratingOperator">Rating Filter</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Optional: Filter businesses by their average
                                rating (1-5 stars). Choose operator and value
                                (e.g., '≥ 4.0' for 4+ stars).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={formData.ratingFilter.operator}
                            onValueChange={handleRatingOperatorChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gte">
                                ≥ (Greater than or equal)
                              </SelectItem>
                              <SelectItem value="gt">
                                &gt; (Greater than)
                              </SelectItem>
                              <SelectItem value="lte">
                                ≤ (Less than or equal)
                              </SelectItem>
                              <SelectItem value="lt">
                                &lt; (Less than)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="ratingFilterValue"
                            name="ratingFilterValue"
                            type="number"
                            value={formData.ratingFilter.value || ""}
                            onChange={handleInputChange}
                            min="1"
                            max="5"
                            step="0.1"
                            placeholder="eg. 4.5"
                          />
                        </div>
                      </div>

                       <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="reviewOperator">
                            Review Count Filter
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Optional: Filter businesses by their total
                                number of reviews. Choose operator and value
                                (e.g., '≥ 50' for businesses with 50+ reviews).
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={formData.reviewFilter.operator}
                            onValueChange={handleReviewOperatorChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gte">
                                ≥ (Greater than or equal)
                              </SelectItem>
                              <SelectItem value="gt">
                                &gt; (Greater than)
                              </SelectItem>
                              <SelectItem value="lte">
                                ≤ (Less than or equal)
                              </SelectItem>
                              <SelectItem value="lt">
                                &lt; (Less than)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="reviewFilterValue"
                            name="reviewFilterValue"
                            type="number"
                            value={formData.reviewFilter.value || ""}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                            placeholder="eg. 100"
                          />
                        </div>
                      </div> 
                    </div>

                    {/* Email Extraction & Validation Options */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <Checkbox
                          id="isExtractEmail"
                          checked={formData.isExtractEmail}
                          onCheckedChange={handleEmailCheckboxChange}
                          disabled={formData.onlyWithoutWebsite}
                        />
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="isExtractEmail"
                            className={`cursor-pointer ${
                              formData.onlyWithoutWebsite
                                ? "text-muted-foreground"
                                : ""
                            }`}
                          >
                            Scrape Email
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enable this option to attempt extracting email
                                addresses from business listings when available.
                                This may increase scraping time but provides
                                additional contact information.
                                {formData.onlyWithoutWebsite && (
                                  <span className="block mt-2 text-yellow-600">
                                    ⚠️ Disabled when "Only Without Website" is enabled
                                  </span>
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <Checkbox
                          id="isValidate"
                          checked={formData.isValidate}
                          onCheckedChange={handleValidateCheckboxChange}
                          disabled={!formData.isExtractEmail || formData.onlyWithoutWebsite}
                        />
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="isValidate"
                            className={`cursor-pointer ${
                              !formData.isExtractEmail || formData.onlyWithoutWebsite
                                ? "text-muted-foreground"
                                : ""
                            }`}
                          >
                            Validate Emails
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enable this option to validate and verify the
                                extracted email addresses. This may increase
                                processing time but ensures higher data quality.
                                {!formData.isExtractEmail && (
                                  <span className="block mt-2 text-yellow-600">
                                    ⚠️ Requires "Scrape Email" to be enabled
                                  </span>
                                )}
                                {formData.onlyWithoutWebsite && (
                                  <span className="block mt-2 text-yellow-600">
                                    ⚠️ Disabled when "Only Without Website" is enabled
                                  </span>
                                )}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <Checkbox
                          id="avoidDuplicate"
                          checked={formData.avoidDuplicate}
                          onCheckedChange={handleAvoidDuplicateCheckboxChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="avoidDuplicate"
                            className="cursor-pointer"
                          >
                            Avoid duplicates from previous searches
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enable this option to exclude businesses that have
                                already been extracted in previous searches. This helps
                                prevent duplicate entries in your database and ensures
                                unique data collection.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <Checkbox
                          id="extractNegativeReviews"
                          checked={formData.extractNegativeReviews}
                          onCheckedChange={handleExtractNegativeReviewsCheckboxChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="extractNegativeReviews"
                            className="cursor-pointer"
                          >
                            Extract Negative Reviews
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enable this option to extract negative reviews (low ratings) 
                                from businesses. This can help identify businesses with poor 
                                customer satisfaction or service quality issues.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div> 

                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <Checkbox
                          id="onlyWithoutWebsite"
                          checked={formData.onlyWithoutWebsite}
                          onCheckedChange={handleOnlyWithoutWebsiteCheckboxChange}
                        />
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="onlyWithoutWebsite"
                            className="cursor-pointer"
                          >
                            Only Without Website
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enable this option to filter and extract only businesses
                                that do not have a website listed. This helps you find
                                businesses that may need web presence services or have
                                limited online visibility.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        disabled={isScraping}
                        className="flex-1 cursor-pointer"
                      >
                        {isScraping ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Scraping...
                          </>
                        ) : (
                          "Start Scraping"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="cursor-pointer"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </form>

                  {/* Status Display */}
                  {(hasCompletedScrape || hasFailed || isScraping) && (
                    <Card className="mt-6">
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Label>Status:</Label>
                          <div
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              scrapeStatus === "scraping"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : scrapeStatus === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : scrapeStatus === "failed"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {scrapeStatus === "scraping" &&
                              "🔄 Scraping in progress..."}
                            {scrapeStatus === "completed" &&
                              "✅ Completed successfully"}
                            {scrapeStatus === "failed" && "❌ Failed"}
                          </div>
                        </div>

                        {hasCompletedScrape && jobId && (
                          <div className="mt-3">
                            <Label>Job ID:</Label>
                            <div className="mt-1 p-2 bg-muted rounded font-mono text-sm break-all">
                              {jobId}
                            </div>
                          </div>
                        )}

                        {isScraping && (
                          <div className="mt-3">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full animate-pulse"
                                style={{ width: "60%" }}
                              ></div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              Please wait while we scrape the data...
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Extraction Guide Dialog */}
      <InfoAlertDialog
        open={showExtractionGuideDialog}
        onOpenChange={setShowExtractionGuideDialog}
        title="📍 How Location Selection Works"
        showPulsingIndicator={true}
        pulsingIndicatorColor="bg-blue-500"
        buttonText="Got it, let's start!"
        sections={[
          {
            variant: "info",
            content: (
              <div className="space-y-2">
                <p className="font-semibold text-sm">
                  Understanding Location-Based Extraction:
                </p>
                <ul className="space-y-1.5 ml-2 text-xs">
                  <li>
                    <strong>🌍 Country Only:</strong> Scrapes data from random
                    locations across the entire country. Best for maximum data
                    coverage.
                  </li>
                  <li>
                    <strong>🗺️ Country + State:</strong> Scrapes data only from
                    the selected state/province. Provides regional focus with
                    good data volume.
                  </li>
                  <li>
                    <strong>📍 Country + State + City:</strong> Scrapes data
                    specifically from the chosen city. Most precise but may
                    yield fewer results.
                  </li>
                </ul>
              </div>
            ),
          },
          {
            variant: "success",
            content: (
              <p className="text-xs">
                <strong>💡 Recommended:</strong> For optimal data volume, use{" "}
                <strong>Country + State</strong> selection. This strikes the
                perfect balance between targeting specific regions and getting
                substantial data results.
              </p>
            ),
          },
          {
            variant: "warning",
            content: (
              <p className="text-xs">
                <strong>⚠️ Note:</strong> Selecting a specific city may
                significantly limit your results, especially for niche business
                categories. If you need more data, consider broadening your
                search to state or country level.
              </p>
            ),
          },
        ]}
      />
    </TooltipProvider>
  );
};

export default Extraction;
