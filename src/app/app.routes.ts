import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleManagementComponent } from './core/components/role-management/role-management.component';
import { RbacGuard } from './core/guards/rbac.guard';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [RbacGuard],
        data: { module: 'dashboard', action: 'view' }
      },
      { 
        path: 'role-management', 
        component: RoleManagementComponent,
        canActivate: [RbacGuard],
        data: { module: 'users', action: 'view' }
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.routes').then(m => m.SALES_ROUTES),
        canActivate: [RbacGuard],
        data: { module: 'sales', action: 'view' }
      },
      {
        path: 'purchase',
        loadChildren: () => import('./purchase/purchase.routes').then(m => m.PURCHASE_ROUTES),
        canActivate: [RbacGuard],
        data: { module: 'purchase', action: 'view' }
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.routes').then(m => m.INVENTORY_ROUTES),
        canActivate: [RbacGuard],
        data: { module: 'inventory', action: 'view' }
      },
      {
        path: 'financial',
        loadChildren: () => import('./financial/financial.routes').then(m => m.FINANCIAL_ROUTES),
        canActivate: [RbacGuard],
        data: { module: 'financial', action: 'view' }
      },
      {
        path: 'accounts',
        loadChildren: () => import('./accounts/accounts.routes').then(m => m.ACCOUNTS_ROUTES),
        canActivate: [RbacGuard],
        data: { module: 'accounts', action: 'view' }
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then(m => m.REPORTS_ROUTES),
        canActivate: [RbacGuard],
        data: { module: 'reports', action: 'view' }
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES),
        canActivate: [RbacGuard],
        data: { module: 'settings', action: 'view' }
      },
      {
        path: 'unauthorized',
        loadComponent: () => import('./core/components/unauthorized/unauthorized.component')
          .then(m => m.UnauthorizedComponent)
      },
      {
        path: '**',
        redirectTo: 'login' 
      }
    ]
  }
];
