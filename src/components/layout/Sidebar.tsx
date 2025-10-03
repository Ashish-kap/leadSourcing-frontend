import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  // Clock,
  // Bookmark,
  Settings,
  CreditCard,
  // HelpCircle,
  LogOut,
  ChevronLeft,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/store/hooks/useAuth";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Plus, label: "New Extraction", href: "/extraction" },
  // { icon: Clock, label: "Extraction History", href: "/history" },
  // { icon: Bookmark, label: "Saved Searches", href: "/saved" },
  { icon: CreditCard, label: "Subscription", href: "/subscription" },
  { icon: Settings, label: "Account", href: "/account" },
  // { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, logout, isLoading: isLoggingOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logout();
      toast.success("Logout Successfully!.");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={cn(
        "h-screen bg-gradient-card border-r border-border transition-all duration-300 ease-smooth relative overflow-hidden",
        "hidden md:block",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CazaLead</h1>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-accent"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {menuItems
          .filter((item) => {
            // Show Subscription only for free plan users
            if (item.href === "/subscription") {
              return user?.user?.plan === "free";
            }
            return true;
          })
          .map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground shadow-glow",
                  isCollapsed && "justify-center"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-2 right-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer",
            isCollapsed && "justify-center px-3"
          )}
          onClick={handleSubmit}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};
