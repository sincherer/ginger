export interface Feature {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  availableInPlans: string[]; // List of billing plans where this feature is available
  isCore: boolean; // If true, feature cannot be disabled
  defaultEnabled: boolean;
  configOptions?: FeatureConfigOption[];
}

export interface FeatureConfigOption {
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'select';
  defaultValue: any;
  options?: string[]; // For select type
  min?: number; // For number type
  max?: number; // For number type
}

export interface CompanyFeature {
  companyId: string;
  featureId: string;
  enabled: boolean;
  config?: Record<string, any>; // Configuration values for this feature
  overrideReason?: string; // Reason if manually enabled/disabled outside of plan
  overrideBy?: string; // User ID who overrode the setting
  overrideDate?: Date;
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
    moduleId: 'core',
    availableInPlans: ['free', 'basic', 'standard', 'premium', 'enterprise'],
    isCore: true,
    defaultEnabled: true
  },
  {
    id: 'sales_management',
    name: 'Sales Management',
    description: 'Manage sales orders and returns',
    moduleId: 'sales',
    availableInPlans: ['basic', 'standard', 'premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true
  },
  {
    id: 'purchase_management',
    name: 'Purchase Management',
    description: 'Manage purchase orders and returns',
    moduleId: 'purchase',
    availableInPlans: ['standard', 'premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true
  },
  {
    id: 'inventory_management',
    name: 'Inventory Management',
    description: 'Manage inventory and stock',
    moduleId: 'inventory',
    availableInPlans: ['basic', 'standard', 'premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true
  },
  {
    id: 'financial_management',
    name: 'Financial Management',
    description: 'Manage financial transactions and reports',
    moduleId: 'financial',
    availableInPlans: ['standard', 'premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true
  },
  {
    id: 'accounts_management',
    name: 'Accounts Management',
    description: 'Manage accounts payable and receivable',
    moduleId: 'accounts',
    availableInPlans: ['standard', 'premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true
  },
  {
    id: 'reports_management',
    name: 'Reports Management',
    description: 'Access and generate reports',
    moduleId: 'reports',
    availableInPlans: ['basic', 'standard', 'premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true,
    configOptions: [
      {
        key: 'export_formats',
        name: 'Export Formats',
        description: 'Available export formats for reports',
        type: 'select',
        defaultValue: 'pdf',
        options: ['pdf', 'excel', 'csv', 'all']
      }
    ]
  },
  {
    id: 'user_management',
    name: 'User Management',
    description: 'Manage users and roles',
    moduleId: 'users',
    availableInPlans: ['standard', 'premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true,
    configOptions: [
      {
        key: 'max_users',
        name: 'Maximum Users',
        description: 'Maximum number of users allowed',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 100
      }
    ]
  },
  {
    id: 'custom_roles',
    name: 'Custom Roles',
    description: 'Create and manage custom user roles',
    moduleId: 'users',
    availableInPlans: ['premium', 'enterprise'],
    isCore: false,
    defaultEnabled: true
  }
];

export const DEFAULT_FEATURE_MODULES: FeatureModule[] = [
  {
    id: 'core',
    name: 'Core',
    description: 'Core system functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'core')
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Sales management functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'sales')
  },
  {
    id: 'purchase',
    name: 'Purchase',
    description: 'Purchase management functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'purchase')
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Inventory management functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'inventory')
  },
  {
    id: 'financial',
    name: 'Financial',
    description: 'Financial management functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'financial')
  },
  {
    id: 'accounts',
    name: 'Accounts',
    description: 'Accounts management functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'accounts'),
    requiredModules: ['financial']
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Reports management functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'reports')
  },
  {
    id: 'users',
    name: 'Users',
    description: 'User management functionality',
    features: DEFAULT_FEATURES.filter(f => f.moduleId === 'users')
  }
];