import React from "react";
import {
  // Bell,
  // User,
  // ChevronDown,
  // CreditCard,
  LogOut,
  Sparkles,
  BadgeCheck,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useAuth } from "@/store/hooks/useAuth";
import { toast } from "sonner";

export const Header: React.FC = () => {
  const { user, logout, isLoading: isLoggingOut } = useAuth();

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const userName = user?.user?.name || "User";
  const userEmail = user?.user?.emailID || "";
  const userInitials = getUserInitials(userName);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left Section with Mobile Menu */}
      <div className="flex items-center space-x-4">
        <MobileMenu />
        <div className="hidden sm:block">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Welcome back, {userName.split(" ")[0]}!
          </h2>
          <p className="text-sm text-muted-foreground hidden md:block">
            Ready to extract some data?
          </p>
        </div>
        <div className="sm:hidden">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Search Bar - Hidden on mobile */}
        {/* <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search extractions..."
            className="pl-10 w-48 xl:w-64 bg-muted border-0 focus:ring-2 focus:ring-primary"
          />
        </div> */}

        {/* Mobile Search Button */}
        {/* <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0">
          <Search className="h-5 w-5" />
        </Button> */}

        {/* Notifications */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-accent h-8 w-8 p-0"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-primary text-primary-foreground flex items-center justify-center">
            3
          </Badge>
        </Button> */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className="gap-2 px-0 h-8 w-auto sm:h-10 cursor-pointer"
              type="button"
            >
              <Avatar className="size-8 cursor-pointer rounded-lg">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {/* <div className="truncate hidden sm:block">{userName}</div> */}
              {/* <ChevronDown className="h-4 w-4" /> */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.user?.plan !== "business" && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Business
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                <span className="text-muted-foreground">Current Plan</span>
                <span className="font-medium text-primary capitalize">
                  {user?.user.plan || "free"}
                </span>
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                className=" cursor-pointer"
                onClick={() => (window.location.href = "/subscription")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <Settings className="mr-2 cursor-pointer h-4 w-4" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
