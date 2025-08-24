import React from "react";
import {
  LucideIcon,
  //  TrendingUp, TrendingDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient = false,
}) => {
  // const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-glow border-border",
        gradient && "bg-gradient-card"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <div className="flex items-center space-x-1">
              {/* <TrendIcon
                className={cn(
                  "h-4 w-4",
                  trend === "up" ? "text-success" : "text-destructive"
                )}
              /> */}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {change}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center",
              gradient ? "bg-primary/10" : "bg-gradient-primary"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                gradient ? "text-primary" : "text-primary-foreground"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
