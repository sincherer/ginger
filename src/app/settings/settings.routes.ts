import { Routes } from '@angular/router';
import { RbacGuard } from '../core/guards/rbac.guard';

export const SETTINGS_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./components/profile-settings/profile-settings.component')
      .then(m => m.ProfileSettingsComponent),
  },
  {
    path: 'company',
    loadComponent: () => import('./components/company-settings/company-settings.component')
      .then(m => m.CompanySettingsComponent),
    canActivate: [RbacGuard],
    data: { module: 'settings', action: 'view' }
  }
];