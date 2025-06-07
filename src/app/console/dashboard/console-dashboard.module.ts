import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ConsoleDashboardComponent } from './console-dashboard.component';

const routes: Routes = [
  { path: '', component: ConsoleDashboardComponent }
];

@NgModule({
  declarations: [
    ConsoleDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ConsoleDashboardModule { }