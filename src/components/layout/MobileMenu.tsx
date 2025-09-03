import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  // Clock,
  // Bookmark,
  // Settings,
  // CreditCard,
  // HelpCircle,
  LogOut,
  Menu,
  X,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/store/hooks/useAuth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Plus, label: "New Extraction", href: "/extraction" },
  // { icon: Clock, label: "Extraction History", href: "/history" },
  // { icon: Bookmark, label: "Saved Searches", href: "/saved" },
  // { icon: Settings, label: "Account Settings", href: "/settings" },
  // { icon: CreditCard, label: "Billing", href: "/billing" },
  // { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLoggingOut } = useAuth();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logout();
      toast.success("Logout Successfully!");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="md:hidden h-8 w-8 p-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="left-0 top-0 h-full w-64 bg-gradient-card border-r border-border shadow-lg relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Map className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    LeadHuntr
                  </h1>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="p-2 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive &&
                        "bg-primary text-primary-foreground shadow-glow"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-4 left-2 right-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
