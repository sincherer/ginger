import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../core/services/company.service';

import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },
  { path: 'new', component: CompanyFormComponent },
  { path: ':id', component: CompanyDetailComponent },
  { path: ':id/edit', component: CompanyFormComponent }
];

@NgModule({
  declarations: [
    CompanyListComponent,
    CompanyFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompanyDetailComponent,
    RouterModule.forChild(routes)
  ],
  providers: [
    CompanyService
  ]
})
export class CompaniesModule { }