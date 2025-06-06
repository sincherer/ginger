import { Routes } from '@angular/router';
import { RbacGuard } from '../core/guards/rbac.guard';

export const REPORTS_ROUTES: Routes = [
  {
    path: 'sales',
    loadComponent: () => import('./components/sales-report/sales-report.component')
      .then(m => m.SalesReportComponent),
    canActivate: [RbacGuard],
    data: { module: 'reports', action: 'view' }
  },
  {
    path: 'inventory',
    loadComponent: () => import('./components/inventory-report/inventory-report.component')
      .then(m => m.InventoryReportComponent),
    canActivate: [RbacGuard],
    data: { module: 'reports', action: 'view' }
  },
  {
    path: 'payments',
    loadComponent: () => import('./components/payments-report/payments-report.component')
      .then(m => m.PaymentsReportComponent),
    canActivate: [RbacGuard],
    data: { module: 'reports', action: 'view' }
  },
  {
    path: 'custom',
    loadComponent: () => import('./components/custom-report/custom-report.component')
      .then(m => m.CustomReportComponent),
    canActivate: [RbacGuard],
    data: { module: 'reports', action: 'create' }
  }
];