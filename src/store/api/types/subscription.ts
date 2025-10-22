export interface CancelSubscriptionRequest {
  subscriptionId: string;
  cancel_at_next_billing_date?: boolean;
}

export interface Subscription {
  subscription_id: string;
  recurring_pre_tax_amount: number;
  tax_inclusive: boolean;
  currency: string;
  status: string;
  created_at: string;
  expires_at: string;
  product_id: string;
  quantity: number;
  trial_period_days: number;
  subscription_period_interval: string;
  payment_frequency_interval: string;
  subscription_period_count: number;
  payment_frequency_count: number;
  next_billing_date: string;
  previous_billing_date: string;
  customer: {
    customer_id: string;
    name: string;
    email: string;
  };
  metadata: {
    sales_rep: string;
    plan: string;
  };
  discount_id: string | null;
  discount_cycles_remaining: number | null;
  cancelled_at: string;
  cancel_at_next_billing_date: boolean;
  billing: {
    country: string;
    state: string;
    city: string;
    street: string;
    zipcode: string;
  };
  on_demand: boolean;
  addons: any[];
  meters: any[];
}

export interface CancelSubscriptionResponse {
  status: string;
  data: {
    subscription: Subscription;
  };
}
