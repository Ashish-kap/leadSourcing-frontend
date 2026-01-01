import { useState, useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  UserCheck, 
  Copy, 
  Check, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useGetAffiliateDataQuery } from '@/store/api/affiliateApi';
import type { PaidReferral } from '@/store/api/types/affiliate';
import { useAuth } from '@/store/hooks/useAuth';

// ============================================
// TYPES
// ============================================
interface Referral {
  id: string;
  name: string;
  email: string;
  amount: number;
  eligibleSince: string;
  status: 'paid' | 'unpaid';
  paidOn: string | null;
}

interface AffiliateData {
  freeTrialCount: number;
  paidPlansCount: number;
  readyToPayout: number;
  totalEarnings: number;
  paidReferrals: Referral[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Format date to readable string */
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

/** Format currency */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

/** Transform API referral to component format */
const transformReferral = (apiReferral: PaidReferral, index: number): Referral => {
  return {
    id: apiReferral.emailID || `referral-${index}`,
    name: apiReferral.name,
    email: apiReferral.emailID,
    amount: apiReferral.amount || 0,
    eligibleSince: apiReferral.eligibleAt,
    status: apiReferral.paid ? 'paid' : 'unpaid',
    paidOn: apiReferral.paidAt,
  };
};

/** Transform API data to component format */
const transformAffiliateData = (apiData: any): AffiliateData => {
  return {
    freeTrialCount: apiData.freeTrialCount || 0,
    paidPlansCount: apiData.paidPlansCount || 0,
    readyToPayout: apiData.readyToPayout || 0,
    totalEarnings: apiData.totalEarnings || 0,
    paidReferrals: (apiData.paidReferrals || []).map((referral: PaidReferral, index: number) => transformReferral(referral, index)),
  };
};

// ============================================
// SKELETON COMPONENTS
// ============================================

const StatCardSkeleton = () => (
  <div className="stat-card p-4 sm:p-6">
    <div className="skeleton h-4 w-24 rounded mb-3" />
    <div className="skeleton h-8 w-16 rounded" />
  </div>
);

const TableRowSkeleton = () => (
  <tr className="table-row">
    <td className="px-4 py-4"><div className="skeleton h-4 w-32 rounded" /></td>
    <td className="px-4 py-4"><div className="skeleton h-4 w-24 rounded" /></td>
    <td className="px-4 py-4"><div className="skeleton h-4 w-20 rounded" /></td>
    <td className="px-4 py-4"><div className="skeleton h-6 w-16 rounded-full" /></td>
    <td className="px-4 py-4"><div className="skeleton h-4 w-20 rounded" /></td>
  </tr>
);

const ReferralCardSkeleton = () => (
  <div className="referral-card p-4">
    <div className="skeleton h-5 w-32 rounded mb-2" />
    <div className="skeleton h-4 w-48 rounded mb-3" />
    <div className="skeleton h-4 w-24 rounded mb-2" />
    <div className="skeleton h-4 w-28 rounded mb-3" />
    <div className="flex justify-between items-center">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-4 w-24 rounded" />
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const Affiliate = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get user data for referral code
  const { user } = useAuth();

  // API call
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAffiliateDataQuery();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const ITEMS_PER_PAGE = 10;
  const CONTACT_EMAIL = 'ask@cazalead.com';

  // Transform API data
  const data: AffiliateData | null = useMemo(() => {
    if (!apiResponse?.data) return null;
    return transformAffiliateData(apiResponse.data);
  }, [apiResponse]);

  // Construct referral link
  const referralLink = useMemo(() => {
    if (!user?.user?.referralCode) return '';
    return `https://cazalead.com/?ref=${user.user.referralCode}`;
  }, [user?.user?.referralCode]);

  // Filtered and paginated referrals
  const filteredReferrals = useMemo(() => {
    if (!data) return [];
    
    return data.paidReferrals.filter(referral => {
      const matchesSearch = 
        referral.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        referral.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || referral.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredReferrals.length / ITEMS_PER_PAGE);
  
  const paginatedReferrals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReferrals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReferrals, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: 'all' | 'paid' | 'unpaid') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Copy functions
  const copyToClipboard = async (text: string, type: 'email' | 'message' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === 'message') {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2000);
      } else if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      console.error('Failed to copy');
    }
  };

  const payoutRequestMessage = `Hello! I would like to request a payout for my affiliate earnings. My ready to payout balance is ${formatCurrency(data?.readyToPayout || 0)}. Please process via PayPal. Thank you!`;

  // ============================================
  // RENDER: LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header Skeleton */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <div className="skeleton h-8 sm:h-10 w-48 sm:w-64 rounded mb-2" />
            <div className="skeleton h-4 sm:h-5 w-64 sm:w-80 rounded" />
          </div>

          {/* Stat Cards Skeleton - Responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <div className="md:col-span-2 lg:col-span-1">
              <StatCardSkeleton />
            </div>
          </div>

          {/* Payout Panel Skeleton */}
          <div className="info-panel p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="skeleton h-4 w-full max-w-md rounded mb-4" />
            <div className="skeleton h-4 w-32 rounded mb-4" />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="skeleton h-10 w-full sm:w-32 rounded" />
              <div className="skeleton h-10 w-full sm:w-40 rounded" />
            </div>
          </div>

          {/* Table/Cards Skeleton */}
          <div className="hidden md:block table-container">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left"><div className="skeleton h-4 w-16 rounded" /></th>
                  <th className="px-4 py-3 text-left"><div className="skeleton h-4 w-12 rounded" /></th>
                  <th className="px-4 py-3 text-left"><div className="skeleton h-4 w-24 rounded" /></th>
                  <th className="px-4 py-3 text-left"><div className="skeleton h-4 w-14 rounded" /></th>
                  <th className="px-4 py-3 text-left"><div className="skeleton h-4 w-16 rounded" /></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
              </tbody>
            </table>
          </div>
          
          <div className="md:hidden space-y-4">
            {[...Array(3)].map((_, i) => <ReferralCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
          </main>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR STATE
  // ============================================
  if (isError) {
    const errorMessage = (error as any)?.data?.message || 'Failed to load affiliate data. Please try again.';
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="alert-error p-6 sm:p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm sm:text-base mb-6 opacity-90">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="btn-primary px-6 py-3 inline-flex items-center gap-2 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
          </main>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: EMPTY STATE (no paid referrals)
  // ============================================
  if (data && data.paidPlansCount === 0) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <header className="mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-foreground mb-1 sm:mb-2">
              Affiliate Program
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Earn $20 for each paid customer you refer.
            </p>
          </header>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="stat-card p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Free Trial Users</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.freeTrialCount}</p>
            </div>
            
            <div className="stat-card p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <UserCheck className="w-5 h-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Paid Plan Users</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{data.paidPlansCount}</p>
            </div>
            
            <div className="stat-card p-4 sm:p-6 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-warning/10">
                  <DollarSign className="w-5 h-5 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Ready to Payout</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(data.readyToPayout)}</p>
            </div>
          </div>

          {/* Empty State */}
          <div className="empty-state p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              No paid referrals yet
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6">
              Start sharing your referral link to earn $20 for every customer who subscribes to a paid plan.
            </p>
            <button onClick={() => copyToClipboard(referralLink, 'link')} className="btn-primary px-6 py-3 text-sm sm:text-base flex items-center gap-2">
              Get Your Referral Link {copiedLink ? <Check className="w-4 h-4 text-blue" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
          </main>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MAIN DASHBOARD
  // ============================================
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* ========== HEADER ========== */}
        <header className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
            Affiliate Program
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Earn $20 for each paid customer you refer.
          </p>
        </header>

        {/* ========== STAT CARDS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Card 1: Free Trial Users */}
          <div className="stat-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Free Trial Users</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data?.freeTrialCount || 0}</p>
          </div>
          
          {/* Card 2: Paid Plan Users */}
          <div className="stat-card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <UserCheck className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Paid Plan Users</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{data?.paidPlansCount || 0}</p>
          </div>
          
          {/* Card 3: Ready to Payout */}
          <div className="stat-card p-4 sm:p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <DollarSign className="w-5 h-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Ready to Payout</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(data?.readyToPayout || 0)}</p>
          </div>
          
          {/* Card 4: Total Earnings */}
          <div className="stat-card p-4 sm:p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Earnings</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(data?.totalEarnings || 0)}</p>
          </div>
        </div>

        {/* ========== PAYOUT INFO PANEL ========== */}
        <div className="info-panel p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm sm:text-base text-foreground">
                For payout requests please contact us via Telegram or email{' '}
                <span className="font-medium">{CONTACT_EMAIL}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Payment method: <span className="font-medium text-foreground">PayPal</span>
              </p>
            </div>
          </div>
          
          {/* Buttons: full-width on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => copyToClipboard(CONTACT_EMAIL, 'email')}
              className="btn-secondary px-4 py-2.5 sm:py-2 flex items-center justify-center gap-2 text-sm font-medium min-h-[44px] sm:min-h-0"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copiedEmail ? 'Copied!' : 'Copy email'}
            </button>
            <button
              onClick={() => copyToClipboard(payoutRequestMessage, 'message')}
              className="btn-secondary px-4 py-2.5 sm:py-2 flex items-center justify-center gap-2 text-sm font-medium min-h-[44px] sm:min-h-0"
            >
              {copiedMessage ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copiedMessage ? 'Copied!' : 'Copy request message'}
            </button>
          </div>
        </div>

        {/* ========== REFERRALS SECTION ========== */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
            Paid Referrals
          </h2>

          {/* ========== SEARCH & FILTER CONTROLS ========== */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 sm:mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="input-field w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm min-h-[44px] sm:min-h-0"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value as 'all' | 'paid' | 'unpaid')}
              className="select-field px-4 py-2.5 sm:py-2 text-sm min-h-[44px] sm:min-h-0 md:w-40"
            >
              <option value="all">All Status</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* ========== DESKTOP/TABLET TABLE (md and up) ========== */}
          <div className="hidden md:block table-container mb-4">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Eligible Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Eligible Since</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Paid On</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      No referrals match your search criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedReferrals.map((referral) => (
                    <tr key={referral.id} className="table-row">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-foreground">{referral.name}</p>
                          <p className="text-sm text-muted-foreground">{referral.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">{formatCurrency(referral.amount)}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(referral.eligibleSince)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          referral.status === 'paid' ? 'badge-paid' : 'badge-unpaid'
                        }`}>
                          {referral.status === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(referral.paidOn)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ========== MOBILE CARD LIST (below md) ========== */}
          <div className="md:hidden space-y-3 mb-4">
            {paginatedReferrals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No referrals match your search criteria.
              </div>
            ) : (
              paginatedReferrals.map((referral) => (
                <div key={referral.id} className="referral-card p-4">
                  <div className="mb-3">
                    <p className="font-medium text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Eligible Amount</p>
                      <p className="text-foreground">{formatCurrency(referral.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Eligible Since</p>
                      <p className="text-foreground">{formatDate(referral.eligibleSince)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                      referral.status === 'paid' ? 'badge-paid' : 'badge-unpaid'
                    }`}>
                      {referral.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Paid: </span>
                      <span className="text-foreground">{formatDate(referral.paidOn)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ========== PAGINATION ========== */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredReferrals.length)} of {filteredReferrals.length} referrals
              </p>
              
              <div className="flex items-center gap-2 order-1 sm:order-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn p-2.5 sm:p-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      return page === 1 || 
                             page === totalPages || 
                             Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, idx, arr) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsisBefore && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`pagination-btn px-3 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 text-sm font-medium ${
                              currentPage === page ? 'active' : ''
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>
                
                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn p-2.5 sm:p-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Affiliate;

