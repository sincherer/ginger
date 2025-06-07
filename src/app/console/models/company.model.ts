import type { Company as BaseCompany } from '../../core/models/company.model';

// Re-export the Company type
export type { Company } from '../../core/models/company.model';

// Add any console-specific interfaces
export interface CompanySettings {
  companyId: string;
  printSettings: PrintSettings;
  features: FeatureSettings;
}

export interface PrintSettings {
  headerText: string;
  footerText: string;
  showLogo: boolean;
  showAddress: boolean;
  showContact: boolean;
}

export interface FeatureSettings {
  modules: ModuleFeature[];
}

export interface ModuleFeature {
  moduleId: string;
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface BillingInfo {
  companyId: string;
  plan: BillingPlan;
  status: BillingStatus;
  startDate: Date;
  endDate: Date;
  paymentMethod?: PaymentMethod;
  invoices: Invoice[];
}

export enum BillingPlan {
  FREE = 'free',
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

export enum BillingStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  TRIAL = 'trial'
}

export interface PaymentMethod {
  type: 'credit_card' | 'bank_transfer' | 'paypal';
  details: Record<string, any>;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  companyId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: Date;
  issueDate: Date;
  paidDate?: Date;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}