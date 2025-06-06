import { Routes } from '@angular/router';
import { RbacGuard } from '../core/guards/rbac.guard';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: 'reminders',
    loadComponent: () => import('./components/payment-reminders/payment-reminders.component')
      .then(m => m.PaymentRemindersComponent),
    canActivate: [RbacGuard],
    data: { module: 'accounts', action: 'view' }
  },
  {
    path: 'reminders/new',
    loadComponent: () => import('./components/payment-reminder-form/payment-reminder-form.component')
      .then(m => m.PaymentReminderFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'accounts', action: 'create' }
  },
  {
    path: 'reminders/:id',
    loadComponent: () => import('./components/payment-reminder-form/payment-reminder-form.component')
      .then(m => m.PaymentReminderFormComponent),
    canActivate: [RbacGuard],
    data: { module: 'accounts', action: 'edit' }
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/reminder-settings/reminder-settings.component')
      .then(m => m.ReminderSettingsComponent),
    canActivate: [RbacGuard],
    data: { module: 'accounts', action: 'edit' }
  }
];