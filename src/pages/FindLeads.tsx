import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { FindLeadsCard } from "@/components/leads/FindLeadsCard";
import { SearchesTable } from "@/components/leads/SearchesTable";

const FindLeads: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <FindLeadsCard />
            <SearchesTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindLeads;
