import React, { useMemo, useState } from "react";
import { Country, State, City } from "country-state-city";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { toast } from "sonner";
import { useStartLeadSearchMutation } from "@/store/api/leadsApi";

/**
 * Minimal v2 "Find Leads" search card: keyword + country/state/city only.
 * Starts a dedicated v2 lead search (POST /leads/searches) — never the v1 scraper.
 */
export const FindLeadsCard: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [maxRecords, setMaxRecords] = useState<number | "">("");
  const [avoidDuplicate, setAvoidDuplicate] = useState(false);
  const [startSearch, { isLoading }] = useStartLeadSearchMutation();

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        value: c.isoCode,
        label: c.name,
      })),
    [],
  );
  const stateOptions = useMemo(
    () =>
      countryCode
        ? State.getStatesOfCountry(countryCode).map((s) => ({
            value: s.isoCode,
            label: s.name,
          }))
        : [],
    [countryCode],
  );
  const cityOptions = useMemo(
    () =>
      countryCode && stateCode
        ? City.getCitiesOfState(countryCode, stateCode).map((c) => ({
            key: `${c.name}-${c.latitude}-${c.longitude}`,
            value: c.name,
            label: c.name,
          }))
        : [],
    [countryCode, stateCode],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim())
      return toast.error("Enter a keyword (e.g. restaurants)");
    if (!countryCode) return toast.error("Select a country");
    try {
      const res = await startSearch({
        keyword: keyword.trim(),
        countryCode,
        stateCode: stateCode || undefined,
        city: city || undefined,
        maxRecords: typeof maxRecords === "number" ? maxRecords : undefined,
        avoidDuplicate,
      }).unwrap();
      toast.success("Lead search started — leads will stream in below.");
      setKeyword("");
      return res;
    } catch (err: any) {
      if (err?.status === 429)
        toast.error("Finish your current search before starting a new one.");
      else if (err?.status === 402)
        toast.error(err?.data?.message || "Not enough credits.");
      else toast.error(err?.data?.message || "Could not start the search.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Leads</CardTitle>
        <CardDescription>
          Search Google Maps for local businesses to audit and pitch. Keyword +
          location — that's it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="keyword">Keyword *</Label>
            <Input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. restaurants, dentists, plumbers"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="country">Country *</Label>
              <SearchableSelect
                id="country"
                options={countryOptions}
                value={countryCode}
                onValueChange={(v) => {
                  setCountryCode(v);
                  setStateCode("");
                  setCity("");
                }}
                placeholder="Select country"
                searchPlaceholder="Search countries..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State/Province</Label>
              <SearchableSelect
                id="state"
                options={stateOptions}
                value={stateCode}
                onValueChange={(v) => {
                  setStateCode(v);
                  setCity("");
                }}
                placeholder="Select state"
                searchPlaceholder="Search states..."
                disabled={!countryCode}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <SearchableSelect
                id="city"
                options={cityOptions}
                value={city}
                onValueChange={setCity}
                placeholder="Select city"
                searchPlaceholder="Search cities..."
                disabled={!stateCode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="maxRecords">Number of leads</Label>
              <Input
                id="maxRecords"
                type="number"
                min={1}
                max={1000}
                value={maxRecords}
                onChange={(e) =>
                  setMaxRecords(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="Default: 50"
              />
            </div>
            <div className="flex items-end pb-1.5">
              <div className="flex items-center space-x-3 flex-shrink-0">
                <Checkbox
                  id="avoidDuplicateLeads"
                  checked={avoidDuplicate}
                  onCheckedChange={(c) => setAvoidDuplicate(c === true)}
                />
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="avoidDuplicateLeads"
                    className="cursor-pointer"
                  >
                    Avoid duplicates from previous searches
                  </Label>
                  <HelpTooltip
                    label="Avoid duplicates from previous searches"
                    content={
                      <>
                        Enable this option to exclude businesses that have
                        already been found in your previous searches, so your
                        lead pool stays unique.
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Find leads
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
