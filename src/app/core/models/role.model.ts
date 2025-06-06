export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  permissions: Permission[];
}

export interface UserRole {
  userId: string;
  roleId: string;
  customPermissions?: Permission[]; // Only for custom roles
}

export const DEFAULT_PERMISSIONS: Permission[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Access to system dashboard',
    module: 'dashboard',
    actions: ['view']
  },
  {
    id: 'settings',
    name: 'Settings Management',
    description: 'Manage system and company settings',
    module: 'settings',
    actions: ['view', 'edit']
  },
  {
    id: 'sales',
    name: 'Sales Management',
    description: 'Manage sales orders and returns',
    module: 'sales',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    id: 'purchase',
    name: 'Purchase Management',
    description: 'Manage purchase orders and returns',
    module: 'purchase',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    description: 'Manage inventory and stock',
    module: 'inventory',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    id: 'financial',
    name: 'Financial Management',
    description: 'Manage financial transactions and reports',
    module: 'financial',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    id: 'accounts',
    name: 'Accounts Management',
    description: 'Manage accounts payable and receivable',
    module: 'accounts',
    actions: ['view', 'create', 'edit', 'delete']
  },
  {
    id: 'reports',
    name: 'Reports Management',
    description: 'Access and generate reports',
    module: 'reports',
    actions: ['view', 'create', 'export']
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage users and roles',
    module: 'users',
    actions: ['view', 'create', 'edit', 'delete']
  }
];

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access',
    isCustom: false,
    permissions: DEFAULT_PERMISSIONS
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Financial and accounting management',
    isCustom: false,
    permissions: DEFAULT_PERMISSIONS.filter(p => 
      ['financial', 'accounts', 'reports'].includes(p.id)
    )
  },
  {
    id: 'it',
    name: 'IT',
    description: 'System and user management',
    isCustom: false,
    permissions: DEFAULT_PERMISSIONS.filter(p => 
      ['users'].includes(p.id)
    )
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'Inventory management',
    isCustom: false,
    permissions: DEFAULT_PERMISSIONS.filter(p => 
      ['inventory'].includes(p.id)
    )
  },
  {
    id: 'purchaser',
    name: 'Purchaser',
    description: 'Purchase management',
    isCustom: false,
    permissions: DEFAULT_PERMISSIONS.filter(p => 
      ['purchase', 'inventory'].includes(p.id)
    )
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Sales management',
    isCustom: false,
    permissions: DEFAULT_PERMISSIONS.filter(p => 
      ['sales', 'inventory'].includes(p.id)
    )
  }
];