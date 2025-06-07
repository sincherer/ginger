export interface Feature {
  id: string;
  name: string;
  description: string;
  module_id: string;
  available_in_plans: string[]; // List of billing plans where this feature is available
  is_core: boolean; // If true, feature cannot be disabled
  default_enabled: boolean;
  config_options?: FeatureConfigOption[];
}

export interface FeatureConfigOption {
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'select';
  default_value: any;
  options?: string[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
}

export interface CompanyFeature {
  company_id: string;
  feature_id: string;
  enabled: boolean;
  config?: Record<string, any>; // Configuration values for this feature
  override_reason?: string; // Reason if manually enabled/disabled outside of plan
  override_by?: string; // User ID who overrode the setting
  override_date?: Date;
}

export interface FeatureModule {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  requiredModules?: string[]; // IDs of modules that must be enabled for this module to work
}

export const DEFAULT_FEATURES: Feature[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Access to system dashboard',
    module_id: 'core',
    available_in_plans: ['free', 'basic', 'standard', 'premium', 'enterprise'],
    is_core: true,
    default_enabled: true
  },
  {
    id: 'sales_management',
    name: 'Sales Management',
    description: 'Manage sales orders and returns',
    module_id: 'sales',
    available_in_plans: ['basic', 'standard', 'premium', 'enterprise'],
    is_core: false,
    default_enabled: true
  },
  {
    id: 'purchase_management',
    name: 'Purchase Management',
    description: 'Manage purchase orders and returns',
    module_id: 'purchase',
    available_in_plans: ['standard', 'premium', 'enterprise'],
    is_core: false,
    default_enabled: true
  },
  {
    id: 'inventory_management',
    name: 'Inventory Management',
    description: 'Manage inventory and stock',
    module_id: 'inventory',
    available_in_plans: ['basic', 'standard', 'premium', 'enterprise'],
    is_core: false,
    default_enabled: true
  },
  {
    id: 'financial_management',
    name: 'Financial Management',
    description: 'Manage financial transactions and reports',
    module_id: 'financial',
    available_in_plans: ['standard', 'premium', 'enterprise'],
    is_core: false,
    default_enabled: true
  },
  {
    id: 'accounts_management',
    name: 'Accounts Management',
    description: 'Manage accounts payable and receivable',
    module_id: 'accounts',
    available_in_plans: ['standard', 'premium', 'enterprise'],
    is_core: false,
    default_enabled: true
  },
  {
    id: 'reports_management',
    name: 'Reports Management',
    description: 'Access and generate reports',
    module_id: 'reports',
    available_in_plans: ['basic', 'standard', 'premium', 'enterprise'],
    is_core: false,
    default_enabled: true,
    config_options: [
      {
        key: 'export_formats',
        name: 'Export Formats',
        description: 'Available export formats for reports',
        type: 'select',
        default_value: 'pdf',
        options: ['pdf', 'excel', 'csv', 'all']
      }
    ]
  },
  {
    id: 'user_management',
    name: 'User Management',
    description: 'Manage users and roles',
    module_id: 'users',
    available_in_plans: ['standard', 'premium', 'enterprise'],
    is_core: false,
    default_enabled: true,
    config_options: [
      {
        key: 'max_users',
        name: 'Maximum Users',
        description: 'Maximum number of users allowed',
        type: 'number',
        default_value: 5,
        min: 1,
        max: 100
      }
    ]
  },
  {
    id: 'custom_roles',
    name: 'Custom Roles',
    description: 'Create and manage custom user roles',
    module_id: 'users',
    available_in_plans: ['premium', 'enterprise'],
    is_core: false,
    default_enabled: true
  }
];

export const DEFAULT_FEATURE_MODULES: FeatureModule[] = [
  {
    id: 'core',
    name: 'Core',
    description: 'Core system functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'core')
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Sales management functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'sales')
  },
  {
    id: 'purchase',
    name: 'Purchase',
    description: 'Purchase management functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'purchase')
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Inventory management functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'inventory')
  },
  {
    id: 'financial',
    name: 'Financial',
    description: 'Financial management functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'financial')
  },
  {
    id: 'accounts',
    name: 'Accounts',
    description: 'Accounts management functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'accounts'),
    requiredModules: ['financial']
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Reports management functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'reports')
  },
  {
    id: 'users',
    name: 'Users',
    description: 'User management functionality',
    features: DEFAULT_FEATURES.filter(f => f.module_id === 'users')
  }
];