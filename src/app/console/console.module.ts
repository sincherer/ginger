import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConsoleService } from './services/console.service';

// Define routes for the console module
const routes: Routes = [
  {
    path: 'console',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/console-dashboard.module').then(m => m.ConsoleDashboardModule) },
      { path: 'companies', loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule) },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
      { path: 'billing', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule) },
      { path: 'features', loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule) },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ConsoleService
  ],
  exports: [
    RouterModule
  ]
})
export class ConsoleModule { }