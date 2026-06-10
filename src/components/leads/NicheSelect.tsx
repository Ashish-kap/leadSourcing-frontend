import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetNichesQuery } from "@/store/api/auditApi";

interface NicheSelectProps {
  value: string;
  onChange: (slug: string) => void;
  placeholder?: string;
  includeAll?: boolean; // adds an "All niches" option (for filtering)
  className?: string;
}

/** Niche dropdown backed by GET /audit/niches (backend is source of truth). */
export const NicheSelect: React.FC<NicheSelectProps> = ({
  value,
  onChange,
  placeholder = "Select niche",
  includeAll = false,
  className,
}) => {
  const { data: niches = [], isLoading } = useGetNichesQuery();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading…" : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All niches</SelectItem>}
        {niches.map((n) => (
          <SelectItem key={n.slug} value={n.slug}>
            {n.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
