import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { toast } from "sonner";
import {
  BillingModal,
  type BillingDetails,
} from "@/components/billing/BillingModal";
import {
  createSubscription,
  type CreateSubscriptionPayload,
} from "@/service/api";
import { PricingCard, type PricingPlan } from "@/components/PricingCard";

const Subscription: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");

  const handleGetStarted = async (productId: string) => {
    setSelectedProductId(productId);
    setIsBillingModalOpen(true);
  };

  const handleBillingSubmit = async (billingData: BillingDetails) => {
    setIsLoading(true);
    try {
      // Get environment variables
      const returnUrl = import.meta.env.VITE_RETURN_URL;

      // Get actual product ID based on plan name
      let actualProductId = "";
      if (selectedProductId === "pro") {
        actualProductId = import.meta.env.VITE_PLAN_PRO;
      } else if (selectedProductId === "business") {
        actualProductId = import.meta.env.VITE_PLAN_BUSINESS;
      }

      if (!actualProductId || !returnUrl) {
        throw new Error("Missing required data: productId or VITE_RETURN_URL");
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
        product_id: actualProductId,
        return_url: returnUrl,
        payment_link: true,
        quantity: 1,
      };

      // Call the subscription API
      const response = await createSubscription(payload);

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
      // Payment processing failed
      // You can add error notification here
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillingModalClose = () => {
    setIsBillingModalOpen(false);
  };

  const pricingPlans: PricingPlan[] = [
    {
      name: "Pro",
      price: "$59",
      oldPrice: "$99",
      period: "/month",
      description: "Best for growing businesses and agencies",
      features: [
        "10000 contacts / month",
        "Complete business profiles",
        "All export formats",
        "Priority support",
        "Advanced filtering",
      ],
      productId: "pro",
      popular: true,
    },
    {
      name: "Business",
      price: "$149",
      oldPrice: "$199",
      period: "/month",
      description: "Best for growing businesses and agencies",
      features: [
        "100000 contacts / month",
        "Complete business profiles",
        "All export formats",
        "Priority support",
        "Advanced filtering",
      ],
      productId: "business",
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <PricingCard
                    key={index}
                    plan={plan}
                    onUpgrade={handleGetStarted}
                  />
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
