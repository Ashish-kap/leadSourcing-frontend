import React from "react";
import {
  // Plus, Upload, FileText,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => navigate("/extraction")}
          className="w-full cursor-pointer justify-start bg-gradient-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
        >
          <Map className="mr-3 h-5 w-5" />
          New Google Maps Extraction
        </Button>

        {/* <Button
          variant="outline"
          className="w-full justify-start hover:bg-accent"
        >
          <Upload className="mr-3 h-5 w-5" />
          Upload CSV for Bulk Search
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start hover:bg-accent"
        >
          <FileText className="mr-3 h-5 w-5" />
          View Saved Templates
        </Button> */}

        {/* <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Recent Searches
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer">
              <span className="text-sm text-foreground">
                Restaurants in NYC
              </span>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer">
              <span className="text-sm text-foreground">Hotels in LA</span>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};
