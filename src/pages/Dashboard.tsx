import React, { useState } from "react";
import {
  BarChart3,
  // Users,
  DollarSign,
  Infinity,
  // Activity,
  // TrendingUp,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ExtractionsTable } from "@/components/dashboard/ExtractionsTable";
// import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetCurrentUserQuery } from "@/store/api/authApi";

export const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: userData } = useGetCurrentUserQuery();

  const statsData = [
    {
      title: "Total Extractions",
      value: userData?.extractionStats.totalExtractions.value.toString() || "0",
      change: userData?.extractionStats.totalExtractions.change || "0%",
      trend: "up" as const,
      icon: BarChart3,
      gradient: true,
    },
    // {
    //   title: "Active Searches",
    //   value: userData?.extractionStats.activeJobs.value.toString() || "0",
    //   change: `${userData?.extractionStats.completedJobs.value || 0} completed`,
    //   trend: "up" as const,
    //   icon: Activity,
    //   gradient: true,
    // },
    {
      title: "Credits Remaining",
      value:
        userData?.user.plan === "business" || userData?.user.plan === "free"
          ? "∞"
          : userData?.user.credits.remaining.toString() || "0",
      change: `${userData?.user.creditPercentage || "0"}% remaining`,
      trend: "up" as const,
      icon: DollarSign,
      gradient: true,
    },
    // {
    //   title: "Current Plan",
    //   value: "45,231",
    //   change: "+180.1% from last month",
    //   trend: "up" as const,
    //   icon: Users,
    // },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statsData.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}

            <Card className="bg-gradient-card sm:block">
              <CardHeader>
                <CardTitle>Extraction Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Jobs</span>
                    <span className="text-foreground">
                      {userData?.extractionStats.totalJobs.value || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Completed Jobs
                    </span>
                    <span className="text-foreground">
                      {userData?.extractionStats.completedJobs.value || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="text-foreground">
                      {userData?.extractionStats.successRate.value || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card sm:block">
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="font-medium text-primary capitalize">
                      {userData?.user.plan || "free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pb-4">
                    <span className="text-muted-foreground">Credits Used</span>
                    <span className="font-medium text-foreground">
                      {userData?.user.plan === "business" ||
                      userData?.user.plan === "free"
                        ? "-"
                        : `${userData?.user.credits.used || 0} / ${
                            userData?.user.credits.total || 0
                          }`}
                    </span>
                  </div>
                  <Progress
                    value={parseFloat(userData?.user.creditPercentage || "0")}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Extractions Table - Takes 2 columns on desktop */}
            <div className="xl:col-span-3 order-1 xl:order-1">
              <ExtractionsTable />
            </div>

            {/* Right Column - Shows first on mobile */}
            {/* <div className="space-y-6 order-1 xl:order-2"> */}
            {/* Quick Actions */}
            {/* <QuickActions /> */}

            {/* Account Overview - Hidden on mobile for space */}
            {/* <Card className="hidden sm:block">
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Plan</span>
                    <span className="font-medium  text-primary">Free</span>
                  </div>
                  <div className="flex justify-between text-sm pb-4">
                    <span className="text-muted-foreground">Credits Used</span>
                    <span className="font-medium text-foreground">
                      7,650 / 10,000
                    </span>
                  </div>
                  <Progress value={76.5} className="h-2" />
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    Usage This Month
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">API Calls</span>
                      <span className="text-foreground">1,234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Data Exports
                      </span>
                      <span className="text-foreground">89</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Saved Searches
                      </span>
                      <span className="text-foreground">12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Performance Chart */}
            {/* <Card className="hidden lg:block">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Monthly Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        This month
                      </span>
                      <span className="text-2xl font-bold text-foreground">
                        +23%
                      </span>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-lg flex items-end justify-center p-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Extraction Success Rate
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          94.5%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            {/* </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
