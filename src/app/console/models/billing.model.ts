import { BillingPlan, BillingStatus } from './company.model';

export interface BillingCycle {
  id: string;
  company_id: string;
  plan: BillingPlan;
  status: BillingStatus;
  start_date: Date;
  end_date: Date;
  renewal_date: Date;
  price: number;
  currency: string;
  interval: 'monthly' | 'quarterly' | 'annual';
  auto_renew: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BillingPlanDetails {
  id: BillingPlan;
  name: string;
  description: string;
  features: string[]; // List of feature IDs included in this plan
  pricing: BillingPlanPricing[];
  userLimit: number;
  storageLimit: number; // In GB
  isActive: boolean;
}

export interface BillingPlanPricing {
  interval: 'monthly' | 'quarterly' | 'annual';
  price: number;
  currency: string;
  discountPercentage?: number;
}

export interface BillingTransaction {
  id: string;
  companyId: string;
  billingCycleId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentReference?: string;
  transactionDate: Date;
  description: string;
}

export const DEFAULT_BILLING_PLANS: BillingPlanDetails[] = [
  {
    id: BillingPlan.FREE,
    name: 'Free',
    description: 'Basic functionality for small businesses',
    features: ['dashboard'],
    pricing: [
      {
        interval: 'monthly',
        price: 0,
        currency: 'USD'
      }
    ],
    userLimit: 2,
    storageLimit: 1,
    isActive: true
  },
  {
    id: BillingPlan.BASIC,
    name: 'Basic',
    description: 'Essential tools for growing businesses',
    features: ['dashboard', 'sales_management', 'inventory_management', 'reports_management'],
    pricing: [
      {
        interval: 'monthly',
        price: 29.99,
        currency: 'USD'
      },
      {
        interval: 'annual',
        price: 299.99,
        currency: 'USD',
        discountPercentage: 16
      }
    ],
    userLimit: 5,
    storageLimit: 10,
    isActive: true
  },
  {
    id: BillingPlan.STANDARD,
    name: 'Standard',
    description: 'Complete solution for established businesses',
    features: [
      'dashboard', 
      'sales_management', 
      'purchase_management', 
      'inventory_management', 
      'financial_management', 
      'accounts_management', 
      'reports_management', 
      'user_management'
    ],
    pricing: [
      {
        interval: 'monthly',
        price: 79.99,
        currency: 'USD'
      },
      {
        interval: 'annual',
        price: 799.99,
        currency: 'USD',
        discountPercentage: 16
      }
    ],
    userLimit: 15,
    storageLimit: 50,
    isActive: true
  },
  {
    id: BillingPlan.PREMIUM,
    name: 'Premium',
    description: 'Advanced features for larger businesses',
    features: [
      'dashboard', 
      'sales_management', 
      'purchase_management', 
      'inventory_management', 
      'financial_management', 
      'accounts_management', 
      'reports_management', 
      'user_management',
      'custom_roles'
    ],
    pricing: [
      {
        interval: 'monthly',
        price: 149.99,
        currency: 'USD'
      },
      {
        interval: 'annual',
        price: 1499.99,
        currency: 'USD',
        discountPercentage: 16
      }
    ],
    userLimit: 50,
    storageLimit: 200,
    isActive: true
  },
  {
    id: BillingPlan.ENTERPRISE,
    name: 'Enterprise',
    description: 'Custom solutions for large enterprises',
    features: [
      'dashboard', 
      'sales_management', 
      'purchase_management', 
      'inventory_management', 
      'financial_management', 
      'accounts_management', 
      'reports_management', 
      'user_management',
      'custom_roles'
    ],
    pricing: [
      {
        interval: 'annual',
        price: 2999.99,
        currency: 'USD'
      }
    ],
    userLimit: 200,
    storageLimit: 1000,
    isActive: true
  }
];