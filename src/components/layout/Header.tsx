import React from "react";
import { Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useGetCurrentUserQuery } from "@/store/api/authApi";

export const Header: React.FC = () => {
  const { data: userData } = useGetCurrentUserQuery();

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const userName = userData?.user?.name || "User";
  const userEmail = userData?.user?.emailID || "";
  const userInitials = getUserInitials(userName);

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
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full"
            >
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
