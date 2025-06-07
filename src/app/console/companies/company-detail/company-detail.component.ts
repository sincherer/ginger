import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

import { ConsoleService } from '../../services/console.service';
import { Company } from '../../models/company.model';
import { ConsoleUser, UserInvitation } from '../../models/user.model';
import { CompanyFeature } from '../../models/feature.model';
import { BillingCycle } from '../../models/billing.model';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class CompanyDetailComponent implements OnInit {
  companyId: string = '';
  company: Company | null = null;
  users: ConsoleUser[] = [];
  invitations: UserInvitation[] = [];
  features: CompanyFeature[] = [];
  billingCycle: BillingCycle | null = null;
  loading = true;
  error = '';
  activeTab = 'overview'; // 'overview', 'users', 'features', 'billing'

  // A 'getter' is accessed like a property, not a method.
  get getActiveFeaturesCount(): number {
    return this.features.filter(f => f.enabled).length;
  }

  getPlanClass(): string {
    return this.billingCycle?.plan?.toLowerCase() || '';
  }

  getStatusClass(): string {
    return this.billingCycle?.status?.toLowerCase() || '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consoleService: ConsoleService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.companyId = params.get('id') || '';
        if (!this.companyId) {
          this.error = 'Company ID is required';
          this.loading = false;
          return of(null);
        }
        return this.loadCompanyData();
      })
    ).subscribe();
  }

  loadCompanyData() {
    this.loading = true;
    this.error = '';

    return this.consoleService.getCompanyById(this.companyId).pipe(
      tap(company => this.company = company),
      switchMap(company => {
        if (!company) {
          return of([[], [], [], null]); 
        }
        return forkJoin([
          this.consoleService.getUsersByCompany(this.companyId),
          this.consoleService.getInvitationsByCompany(this.companyId),
          this.consoleService.getCompanyFeatures(this.companyId),
          this.consoleService.getCompanyBillingCycle(this.companyId).pipe(
            catchError(err => {
              console.error('Failed to load billing cycle:', err);
              return of(null);
            })
          )
        ]);
      }),
      tap(([users, invitations, features, billingCycle]) => {
        this.users = users as ConsoleUser[];
        this.invitations = invitations as UserInvitation[];
        this.features = features as CompanyFeature[];
        this.billingCycle = billingCycle as BillingCycle | null;
      }),
      catchError(err => {
        this.error = 'Failed to load company data: ' + err.message;
        this.company = null;
        this.users = [];
        this.invitations = [];
        this.features = [];
        this.billingCycle = null;
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  editCompany(): void {
    this.router.navigate(['/console/companies', this.companyId, 'edit']);
  }

  inviteUser(): void {
    this.router.navigate(['/console/users/invite'], { queryParams: { companyId: this.companyId } });
  }

  manageBilling(): void {
    this.router.navigate(['/console/billing', this.companyId]);
  }

  manageFeatures(): void {
    this.router.navigate(['/console/features', this.companyId]);
  }

  viewUser(userId: string): void {
    this.router.navigate(['/console/users', userId]);
  }

  editUser(userId: string): void {
    this.router.navigate(['/console/users', userId, 'edit']);
  }

  impersonateUser(userId: string): void {
    const adminUserId = 'console-admin-1';
    this.consoleService.createImpersonationSession(adminUserId, userId, this.companyId).subscribe({
      next: (session) => {
        alert(`Impersonation session created. Token: ${session.token}`);
      },
      error: (err) => {
        this.error = 'Failed to create impersonation session: ' + err.message;
      }
    });
  }

  // Renamed from 'onFeatureToggle'
  toggleFeature(featureId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isEnabled = checkbox.checked;

    if (this.company) {
      this.consoleService.toggleFeature(this.company.id, featureId, isEnabled)
        .subscribe({
          next: (updatedFeature) => {
            const index = this.features.findIndex(f => f.feature_id === featureId);
            if (index !== -1) {
              this.features[index] = updatedFeature;
            }
          },
          error: (error) => {
            checkbox.checked = !isEnabled;
            this.error = 'Failed to update feature: ' + error.message;
          }
        });
    }
  }

  refreshData(): void {
    this.loadCompanyData();
  }
}