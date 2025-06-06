import { Routes } from '@angular/router';
import { RbacGuard } from '../core/guards/rbac.guard';

export const FINANCIAL_ROUTES: Routes = [
  {
    path: 'receivables',
    loadComponent: () => import('./components/receivables/receivables.component')
      .then(m => m.ReceivablesComponent),
    canActivate: [RbacGuard],
    data: { module: 'financial', action: 'view' }
  },
  {
    path: 'receivables/new',
    loadComponent: () => import('./components/receivable-form/receivable-form.component')
      .then(m => m.ReceivableFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'financial', action: 'create' }
  },
  {
    path: 'receivables/:id',
    loadComponent: () => import('./components/receivable-form/receivable-form.component')
      .then(m => m.ReceivableFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'financial', action: 'edit' }
  },
  {
    path: 'payables',
    loadComponent: () => import('./components/payables/payables.component')
      .then(m => m.PayablesComponent),
    canActivate: [RbacGuard],
    data: { module: 'financial', action: 'view' }
  },
  {
    path: 'payables/new',
    loadComponent: () => import('./components/payable-form/payable-form.component')
      .then(m => m.PayableFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'financial', action: 'create' }
  },
  {
    path: 'payables/:id',
    loadComponent: () => import('./components/payable-form/payable-form.component')
      .then(m => m.PayableFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'financial', action: 'edit' }
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/financial-reports/financial-reports.component')
      .then(m => m.FinancialReportsComponent),
    canActivate: [RbacGuard],
    data: { module: 'financial', action: 'view' }
  }
];