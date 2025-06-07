import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConsoleDashboardComponent } from './console-dashboard.component';

const routes: Routes = [
  { path: '', component: ConsoleDashboardComponent }
];

@NgModule({
  declarations: [
    // ConsoleDashboardComponent is standalone, so it should not be declared here
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ConsoleDashboardComponent // Import the standalone component instead
  ]
})
export class ConsoleDashboardModule { }