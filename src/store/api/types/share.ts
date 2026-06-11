// Public share (lead-magnet) types — mirrors v2/controllers/share.controller.js.

import { Severity } from "./audit";

export interface PublicLead {
  businessName: string;
  city?: string;
  category?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  reviewsCount?: number;
  score: number | null;
  issues: { code: string; severity: Severity }[];
  masked?: boolean;
}

export interface PublicShareData {
  keyword?: string;
  location?: string;
  scrapedAt?: string;
  totalLeads: number;
  visible: PublicLead[];
  teaser: PublicLead[];
  remainingCount: number;
  /** Share creator's referral code — signups from this page attribute to them. */
  refCode?: string;
}

export interface GetPublicShareResponse {
  status: string;
  data: PublicShareData;
}

export interface CreateShareResponse {
  status: string;
  shareId: string;
}
