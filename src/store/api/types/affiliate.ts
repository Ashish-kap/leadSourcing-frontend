export interface PaidReferral {
  name: string;
  emailID: string;
  eligibleAt: string;
  paidAt: string | null;
  paid: boolean;
  amount: number;
}

export interface AffiliateData {
  freeTrialCount: number;
  paidPlansCount: number;
  paidPlansPaidCount: number;
  readyToPayout: number;
  totalEarnings: number;
  paidReferrals: PaidReferral[];
}

export interface GetAffiliateResponse {
  status: "success" | "error";
  data: AffiliateData;
  message?: string;
}

