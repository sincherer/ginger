import { Routes } from '@angular/router';
import { RbacGuard } from '../core/guards/rbac.guard';

export const SALES_ROUTES: Routes = [
  {
    path: 'orders',
    loadComponent: () => import('./components/sales-orders/sales-orders.component')
      .then(m => m.SalesOrdersComponent),
    canActivate: [RbacGuard],
    data: { module: 'sales', action: 'view' }
  },
  {
    path: 'orders/new',
    loadComponent: () => import('./components/sales-order-form/sales-order-form.component')
      .then(m => m.SalesOrderFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'sales', action: 'create' }
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./components/sales-order-form/sales-order-form.component')
      .then(m => m.SalesOrderFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'sales', action: 'edit' }
  },
  {
    path: 'returns',
    loadComponent: () => import('./components/sales-returns/sales-returns.component')
      .then(m => m.SalesReturnsComponent),
    canActivate: [RbacGuard],
    data: { module: 'sales', action: 'view' }
  },
  {
    path: 'returns/new',
    loadComponent: () => import('./components/sales-return-form/sales-return-form.component')
      .then(m => m.SalesReturnFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'sales', action: 'create' }
  },
  {
    path: 'returns/:id',
    loadComponent: () => import('./components/sales-return-form/sales-return-form.component')
      .then(m => m.SalesReturnFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'sales', action: 'edit' }
  }
];