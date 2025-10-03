import React from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/store/hooks/useAuth";
import { CancelSubscriptionModal } from "@/components/feedback/FeedbackModal";

const Account = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const { user } = useAuth();

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get plan display name
  const getPlanDisplayName = (plan: string) => {
    const planMap: Record<string, string> = {
      business: "Business",
      professional: "Professional",
      premium: "Premium",
      free: "Free",
    };
    return planMap[plan] || plan;
  };

  // Helper function to format billing cycle
  const formatBillingCycle = (cycle: string | null | undefined) => {
    if (!cycle) return "N/A";

    const cycleMap: Record<string, string> = {
      month: "Monthly",
      year: "Yearly",
      monthly: "Monthly",
      yearly: "Yearly",
    };

    return cycleMap[cycle.toLowerCase()] || cycle;
  };

  // Helper function to get subscription status
  const getSubscriptionStatus = () => {
    if (!user?.user?.subscription?.status) return "Inactive";

    const statusMap: Record<string, string> = {
      pending: "Pending",
      active: "Active",
      on_hold: "On Hold",
      cancelled: "Cancelled",
      failed: "Failed",
      expired: "Expired",
    };

    return statusMap[user.user.subscription.status] || "Unknown";
  };

  // Generate account data from API response
  const accountData = [
    {
      label: "Status",
      value: getSubscriptionStatus(),
      highlight: user?.user?.subscription?.status === "active",
    },
    {
      label: "Account Type",
      value: getPlanDisplayName(user?.user?.plan || "free"),
    },
    // {
    //   label: "Plan Type",
    //   value: `${getPlanDisplayName(user?.user?.plan || "free")} Plan`,
    // },
    {
      label: "Next Billing Period",
      value: formatDate(user?.user?.subscription?.nextBillingDate ?? null),
    },
    {
      label: "Billing Cycle",
      value: formatBillingCycle(
        user?.user?.subscription?.paymentFrequencyInterval
      ),
    },
    {
      label: "Next Invoice",
      value: user?.user?.plan === "business" ? "$9.00" : "$0.00",
    },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                Account
              </h1>
              <p className="text-muted-foreground">
                Manage your account settings and subscription
              </p>
            </div>

            {/* Account Information Card */}
            <div className="card-elegant rounded-[var(--radius)] p-6 md:p-8 mb-6">
              <div className="space-y-6">
                {accountData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-6 border-b border-border last:border-0 last:pb-0"
                  >
                    <span className="text-sm md:text-base text-muted-foreground font-medium">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.highlight && (
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      )}
                      <span className="text-sm md:text-base font-semibold">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="destructive"
                size="lg"
                className="w-full sm:w-auto cursor-pointer"
                disabled={user?.user?.plan === "free"}
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Subscription
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full cursor-pointer sm:w-auto glass-card"
                onClick={() => window.open("mailto:ask@cazalead.com", "_blank")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
};

export default Account;
