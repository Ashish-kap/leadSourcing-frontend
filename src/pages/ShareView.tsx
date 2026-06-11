import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { setCookie } from "@/utils/cookies";
import { useGetPublicShareQuery } from "@/store/api/shareApi";
import { PublicLead } from "@/store/api/types/share";
import { ScoreBadge } from "@/components/leads/ScoreBadge";
import { issueLabel, severityClass } from "@/components/leads/auditMeta";

const IssueBadgeList: React.FC<{ lead: PublicLead }> = ({ lead }) => (
  <div className="flex flex-wrap gap-1">
    {lead.issues.map((i) => (
      <Badge
        key={i.code}
        variant="outline"
        className={cn("text-xs", severityClass[i.severity])}
      >
        {issueLabel(i.code)}
      </Badge>
    ))}
  </div>
);

// Mobile (< md): stacked card so the score badge and issue list — the hook —
// are visible without horizontal scrolling.
const LeadCard: React.FC<{ lead: PublicLead }> = ({ lead }) => {
  const masked = !!lead.masked;
  const blur = masked ? "blur-[3px] select-none" : "";
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-3 space-y-2",
        masked && "bg-muted/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("min-w-0", blur)}>
          <p className="font-medium truncate">{lead.businessName}</p>
          {lead.city && (
            <p className="text-xs text-muted-foreground">{lead.city}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {masked && <Lock className="h-4 w-4 text-muted-foreground" />}
          <ScoreBadge score={lead.score} size="sm" />
        </div>
      </div>
      {(lead.email || lead.phone || lead.website) && (
        <div className={cn("text-sm space-y-0.5", blur)}>
          {lead.email && <p className="truncate">{lead.email}</p>}
          {lead.phone && <p className="text-muted-foreground">{lead.phone}</p>}
          {lead.website && (
            <p className="text-muted-foreground truncate">{lead.website}</p>
          )}
        </div>
      )}
      <IssueBadgeList lead={lead} />
    </div>
  );
};

const LeadRow: React.FC<{ lead: PublicLead }> = ({ lead }) => {
  const masked = !!lead.masked;
  const blur = masked ? "blur-[3px] select-none" : "";
  return (
    <TableRow className={masked ? "bg-muted/30" : ""}>
      <TableCell className={cn("font-medium", blur)}>
        {lead.businessName}
        {lead.city && (
          <span className="block text-xs text-muted-foreground">
            {lead.city}
          </span>
        )}
      </TableCell>
      <TableCell className={blur}>
        {lead.email || lead.phone ? (
          <>
            {lead.email && <span className="block text-sm">{lead.email}</span>}
            {lead.phone && (
              <span className="block text-sm text-muted-foreground">
                {lead.phone}
              </span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className={blur}>
        {lead.website ? (
          <span className="text-sm">{lead.website}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <ScoreBadge score={lead.score} size="sm" />
      </TableCell>
      <TableCell>
        <IssueBadgeList lead={lead} />
      </TableCell>
      <TableCell className="w-10 text-center">
        {masked && <Lock className="inline h-4 w-4 text-muted-foreground" />}
      </TableCell>
    </TableRow>
  );
};

const ShareView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const { data, isLoading, isError } = useGetPublicShareQuery(shareId!, {
    skip: !shareId,
  });

  const share = data?.data;

  // Attribute signups from this page to the share creator: store their
  // referral code in the same `ref` cookie the login/signup flow reads, so
  // both Google and email signups credit them.
  useEffect(() => {
    if (share?.refCode) {
      setCookie("ref", share.refCode, 30, {
        path: "/",
        secure: window.location.protocol === "https:",
        sameSite: "lax",
      });
    }
  }, [share?.refCode]);

  const signupHref = share?.refCode
    ? `/signup?ref=${share.refCode}`
    : "/signup";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CazaLead</span>
          </div>
          <Button asChild>
            <Link to={signupHref}>Sign up free</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {isLoading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-24 space-y-4">
            <p className="text-lg font-medium">
              This link is no longer available.
            </p>
            <Button asChild>
              <Link to={signupHref}>
                Get your own leads <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {share && (
          <>
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-bold capitalize">
                {/* {share.totalLeads} */}
                {share.keyword} leads
                {share.location ? ` in ${share.location}` : ""}
              </h1>
              <p className="text-muted-foreground">
                Scraped from Google Maps
                {share.scrapedAt
                  ? ` on ${new Date(share.scrapedAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`
                  : ""}{" "}
                &amp; website-audited by CazaLead. The lowest-scoring websites
                are the businesses that need your services most — the issues
                column is your sales pitch.
              </p>
            </div>

            {/* Mobile: stacked cards keep score + issues in the first glance. */}
            <div className="space-y-3 md:hidden">
              {share.visible.map((l, i) => (
                <LeadCard key={`v-${i}`} lead={l} />
              ))}
              {share.teaser.map((l, i) => (
                <LeadCard key={`t-${i}`} lead={l} />
              ))}
            </div>

            <div className="hidden md:block border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-muted/50">Business</TableHead>
                      <TableHead className="bg-muted/50">Contact</TableHead>
                      <TableHead className="bg-muted/50">Website</TableHead>
                      <TableHead className="bg-muted/50 w-20 text-center">
                        Score
                      </TableHead>
                      <TableHead className="bg-muted/50">Issues</TableHead>
                      <TableHead className="bg-muted/50 w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {share.visible.map((l, i) => (
                      <LeadRow key={`v-${i}`} lead={l} />
                    ))}
                    {share.teaser.map((l, i) => (
                      <LeadRow key={`t-${i}`} lead={l} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {share.remainingCount > 0 && (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                …and {share.remainingCount} more leads in this list.
              </p>
            )}

            <Card className="mt-8 border-primary/30 bg-primary/5">
              <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                <h2 className="text-xl font-semibold">
                  Get leads like these for any niche, in any city
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Every lead comes with contact details, a website score, and
                  the exact issues to pitch — your outreach email practically
                  writes itself. Free plan, no card required.
                </p>
                <Button size="lg" asChild>
                  <Link to={signupHref}>
                    Sign up free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default ShareView;
