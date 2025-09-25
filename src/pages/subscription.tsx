import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
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
import { toast } from "sonner";
import {
  BillingModal,
  type BillingDetails,
} from "@/components/billing/BillingModal";
import {
  createSubscription,
  type CreateSubscriptionPayload,
} from "@/service/api";

const Subscription: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGetStarted = async () => {
    setIsBillingModalOpen(true);
  };

  const handleBillingSubmit = async (billingData: BillingDetails) => {
    setIsLoading(true);
    try {
      // Get environment variables
      const productId = import.meta.env.VITE_PRODUCT_ID;
      const returnUrl = import.meta.env.VITE_RETURN_URL;

      if (!productId || !returnUrl) {
        throw new Error(
          "Missing required environment variables: VITE_PRODUCT_ID or VITE_RETURN_URL"
        );
      }

      // Prepare API payload
      const payload: CreateSubscriptionPayload = {
        billing: {
          city: billingData.city,
          country: billingData.country,
          state: billingData.state,
          street: billingData.street,
          zipcode: billingData.zipcode,
        },
        product_id: productId,
        return_url: returnUrl,
        payment_link: true,
        quantity: 1,
      };

      console.log("Creating subscription with payload:", payload);

      // Call the subscription API
      const response = await createSubscription(payload);

      console.log("Subscription created successfully:", response);

      // Check if response is successful and has payment link
      if (
        response.status === "success" &&
        response.data?.subscription?.payment_link
      ) {
        // Close modal first
        setIsBillingModalOpen(false);

        // Redirect to payment link
        window.location.href = response.data.subscription.payment_link;
      } else {
        throw new Error("Invalid response from subscription API");
      }

      // You can add success notification here
      toast.success("Redirecting to payment...");
    } catch (error) {
      console.error("Payment processing failed:", error);
      // You can add error notification here
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillingModalClose = () => {
    setIsBillingModalOpen(false);
  };

  const pricingPlans = [
    // {
    //   name: "Starter",
    //   price: "$0",
    //   period: "/month",
    //   description: "Perfect for small businesses and freelancers",
    //   features: [
    //     "Limited extractions",
    //     "Basic business info",
    //     "CSV export",
    //     "Email support",
    //     "Basic filtering",
    //   ],
    //   popular: false,
    // },
    {
      name: "Professional",
      price: "$9",
      oldPrice: "$29",
      period: "/month",
      description: "Best for growing businesses and agencies",
      features: [
        "Unlimited extractions",
        "Complete business profiles",
        "All export formats",
        "Priority support",
        "Advanced filtering",
        // "API access",
        "Bulk processing",
      ],
      popular: true,
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
          <div className="max-w-5xl mx-auto">
            <section className="py-6">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                  Upgrade your plan
                </h2>
                <p className="text-muted-foreground">
                  Choose a plan that fits your workflow. Cancel anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-sm mx-auto">
                {pricingPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`relative ${
                      plan.popular
                        ? "border-primary shadow-xl scale-[1.02]"
                        : ""
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                        Limited Time Offer
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl sm:text-2xl">
                        {plan.name}
                      </CardTitle>
                      <div className="mt-4 flex items-center justify-center gap-3">
                        {(plan as any).oldPrice ? (
                          <span className="text-lg sm:text-xl text-muted-foreground line-through">
                            {(plan as any).oldPrice}
                          </span>
                        ) : null}
                        <span className="text-3xl sm:text-4xl font-bold">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
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
                      <Button
                        className={`w-full mt-6 cursor-pointer ${
                          plan.popular ? "bg-primary" : ""
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={handleGetStarted}
                      >
                        Upgrade
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <BillingModal
        open={isBillingModalOpen}
        onOpenChange={handleBillingModalClose}
        onSubmit={handleBillingSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Subscription;
