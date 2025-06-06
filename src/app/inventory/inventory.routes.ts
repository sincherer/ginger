import { Routes } from '@angular/router';
import { RbacGuard } from '../core/guards/rbac.guard';

export const INVENTORY_ROUTES: Routes = [
  {
    path: 'query',
    loadComponent: () => import('./components/inventory-query/inventory-query.component')
      .then(m => m.InventoryQueryComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'view' }
  },
  {
    path: 'stock-in',
    loadComponent: () => import('./components/stock-in/stock-in.component')
      .then(m => m.StockInComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'create' }
  },
  {
    path: 'stock-in/:id',
    loadComponent: () => import('./components/stock-in/stock-in.component')
      .then(m => m.StockInComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'edit' }
  },
  {
    path: 'stock-out',
    loadComponent: () => import('./components/stock-out/stock-out.component')
      .then(m => m.StockOutComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'create' }
  },
  {
    path: 'stock-out/:id',
    loadComponent: () => import('./components/stock-out/stock-out.component')
      .then(m => m.StockOutComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'edit' }
  },
  {
    path: 'adjustments',
    loadComponent: () => import('./components/inventory-adjustments/inventory-adjustments.component')
      .then(m => m.InventoryAdjustmentsComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'view' }
  },
  {
    path: 'adjustments/new',
    loadComponent: () => import('./components/inventory-adjustment-form/inventory-adjustment-form.component')
      .then(m => m.InventoryAdjustmentFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'create' }
  },
  {
    path: 'adjustments/:id',
    loadComponent: () => import('./components/inventory-adjustment-form/inventory-adjustment-form.component')
      .then(m => m.InventoryAdjustmentFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'inventory', action: 'edit' }
  }
];