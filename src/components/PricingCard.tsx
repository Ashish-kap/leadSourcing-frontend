import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { CountdownTimer } from "@/components/CounterTimer";

export interface PricingPlan {
  name: string;
  price: string;
  oldPrice?: string;
  period: string;
  description: string;
  features: string[];
  productId: string;
  popular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onUpgrade: (productId: string) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  onUpgrade,
}) => {
  const handleUpgrade = () => {
    onUpgrade(plan.productId);
  };

  return (
    <Card
      className={`relative ${
        plan.popular ? "border-primary shadow-xl scale-[1.02]" : ""
      }`}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Limited Time Offer
        </Badge>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>

        <div className="mt-4 flex items-center justify-center gap-3">
          {plan.oldPrice && (
            <span className="text-lg sm:text-xl text-muted-foreground line-through">
              {plan.oldPrice}
            </span>
          )}
          <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
          <span className="text-muted-foreground">{plan.period}</span>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {plan.popular && (
          <div className="mt-6">
            <CountdownTimer />
          </div>
        )}

        <Button
          className={`w-full mt-2 cursor-pointer ${
            plan.popular ? "bg-primary" : ""
          }`}
          variant={plan.popular ? "default" : "outline"}
          onClick={handleUpgrade}
        >
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};
