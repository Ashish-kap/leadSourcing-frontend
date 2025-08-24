export interface User {
  credits: {
    total: number;
    used: number;
    remaining: number;
  };
  _id: string;
  emailID: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  creditPercentage: string;
  id: string;
}

export interface ExtractionStats {
  totalExtractions: {
    value: number;
    change: string;
  };
  dataPointsCollected: {
    value: number;
    change: string;
  };
  activeJobs: {
    value: number;
  };
  totalCreditsUsed: {
    value: number;
  };
  completedJobs: {
    value: number;
  };
  totalJobs: {
    value: number;
  };
  successRate: {
    value: string;
  };
}

export interface MeResponse {
  status: string;
  data: {
    user: User;
    extractionStats: ExtractionStats;
  };
}

export interface LoginRequest {
  emailID: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  emailID: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginResponse {
  status: string;
  token: string;
  refresh?: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
