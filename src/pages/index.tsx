import { useEffect, useState } from "react";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface ScrapeJob {
  id: string;
  status: "active" | "completed" | "failed";
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  result: [];
}

const BASE_URL = "https://leadsourcing-backend-production.up.railway.app";

const convertToCSV = (data: any[]) => {
  if (data.length === 0) return "";
  const allKeys = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  );
  const header = allKeys.join(",") + "\n";
  const rows = data.map((item) =>
    allKeys
      .map((key) => {
        let value = item[key];
        if (Array.isArray(value)) {
          value = value
            .map((v) =>
              typeof v === "object" ? `${v.day}: ${v.hours}` : String(v)
            )
            .join(" | ");
        } else if (typeof value === "object" && value !== null) {
          value = JSON.stringify(value);
        } else if (value === null || value === undefined) {
          value = "";
        }

        const stringValue = String(value);
        return stringValue.includes(",") || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      })
      .join(",")
  );
  return header + rows.join("\n");
};

export default function ScraperPage() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [job, setJob] = useState<ScrapeJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  //   const { toast } = useToast();

  // Fetch countries
  const countries = Country.getAllCountries();

  const handleReset = () => {
    setKeyword("");
    setCountry("");
    setState("");
    setCity("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const selectedCountry = countries.find((c) => c.isoCode === country);
    if (!selectedCountry) {
      throw new Error("Invalid country selection");
    }
    try {
      const { data } = await axios.post(`${BASE_URL}/api/scrape`, {
        keyword,
        city: city ? city : state,
        country,
        state: selectedCountry?.name || country,
      });

      setJob({
        id: data.jobId,
        status: "active",
        progress: { current: 0, total: 0, percentage: 0 },
        result: [],
      });
    } catch (error) {
      toast("Scraping Failed", {
        description: "Failed to start scraping job",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!job?.id || job.status !== "active") return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/jobs/${job.id}`);
        setJob(data);
        if (data.status === "completed") {
          clearInterval(interval);
          toast("Scraping Complete!", {
            description: "Your data is ready for download",
          });
        }

        if (data.status === "failed") {
          clearInterval(interval);
          setJob(null);
          handleReset();
          toast("Scraping Failed", {
            description: "Error occurred during scraping",
          });
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [job?.id, job?.status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-30 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
            Google Maps Data Extractor
          </h1>
          <p className="text-xl text-gray-600">
            Extract business listings from Google Maps instantly
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-2xl shadow-lg"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Restaurants, Plumbers"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState("");
                  setCity("");
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity("");
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!country}
              >
                <option value="">Select State</option>
                {State.getStatesOfCountry(country).map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!state}
              >
                <option value="">Select City</option>
                {City.getCitiesOfState(country, state).map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!job}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <ReloadIcon className="h-4 w-4 animate-spin" />
                Starting Scraper...
              </div>
            ) : (
              "Extract Data Now"
            )}
          </button>
        </form>

        {job && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                {job.status === "active" && job.progress.total === 0
                  ? "Scraping in Progress..."
                  : ""}
                {job.progress.total > 0 &&
                job.status !== "failed" &&
                job.status !== "completed"
                  ? `We have found ${job.progress.total} leads. Scraping in Progress...`
                  : ""}
                {job.status === "completed" && "Scraping Complete!"}
                {job.status === "failed" && "Scraping Failed"}
              </h3>
            </div>
            <Progress value={job.progress.percentage} />
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>
                {job.progress.current} of {job.progress.total} processed
              </span>
              <span>{job.progress.percentage}%</span>
            </div>
            {job.status === "completed" && job.result && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    handleReset();
                    const csvContent = convertToCSV(job.result);
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `data-${Date.now()}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    setJob(null);
                  }}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Download CSV
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
