import { Routes } from '@angular/router';
import { RbacGuard } from '../core/guards/rbac.guard';

export const PURCHASE_ROUTES: Routes = [
  {
    path: 'orders',
    loadComponent: () => import('./components/purchase-orders/purchase-orders.component')
      .then(m => m.PurchaseOrdersComponent),
    canActivate: [RbacGuard],
    data: { module: 'purchase', action: 'view' }
  },
  {
    path: 'orders/new',
    loadComponent: () => import('./components/purchase-order-form/purchase-order-form.component')
      .then(m => m.PurchaseOrderFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'purchase', action: 'create' }
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./components/purchase-order-form/purchase-order-form.component')
      .then(m => m.PurchaseOrderFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'purchase', action: 'edit' }
  },
  {
    path: 'returns',
    loadComponent: () => import('./components/purchase-returns/purchase-returns.component')
      .then(m => m.PurchaseReturnsComponent),
    canActivate: [RbacGuard],
    data: { module: 'purchase', action: 'view' }
  },
  {
    path: 'returns/new',
    loadComponent: () => import('./components/purchase-return-form/purchase-return-form.component')
      .then(m => m.PurchaseReturnFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'purchase', action: 'create' }
  },
  {
    path: 'returns/:id',
    loadComponent: () => import('./components/purchase-return-form/purchase-return-form.component')
      .then(m => m.PurchaseReturnFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'purchase', action: 'edit' }
  }
];