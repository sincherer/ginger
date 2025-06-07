import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consoleService: ConsoleService
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.companyId) {
      this.error = 'Company ID is required';
      this.loading = false;
      return;
    }

    this.loadCompanyData();
  }

  loadCompanyData(): void {
    this.loading = true;
    this.error = '';

    // Load company details
    this.consoleService.getCompanyById(this.companyId).subscribe({
      next: (company) => {
        this.company = company;
        
        // Load users
        this.consoleService.getUsersByCompany(this.companyId).subscribe({
          next: (users) => {
            this.users = users;
            
            // Load invitations
            this.consoleService.getInvitationsByCompany(this.companyId).subscribe({
              next: (invitations) => {
                this.invitations = invitations;
                
                // Load features
                this.consoleService.getCompanyFeatures(this.companyId).subscribe({
                  next: (features) => {
                    this.features = features;
                    
                    // Load billing cycle
                    this.consoleService.getCompanyBillingCycle(this.companyId).subscribe({
                      next: (billingCycle) => {
                        this.billingCycle = billingCycle;
                        this.loading = false;
                      },
                      error: (err) => {
                        console.error('Failed to load billing cycle:', err);
                        this.loading = false;
                      }
                    });
                  },
                  error: (err) => {
                    console.error('Failed to load features:', err);
                    this.loading = false;
                  }
                });
              },
              error: (err) => {
                console.error('Failed to load invitations:', err);
                this.loading = false;
              }
            });
          },
          error: (err) => {
            console.error('Failed to load users:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load company: ' + err.message;
        this.loading = false;
      }
    });
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
    // Get current user ID (would come from auth service in a real app)
    const adminUserId = 'console-admin-1';
    
    this.consoleService.createImpersonationSession(adminUserId, userId, this.companyId).subscribe({
      next: (session) => {
        // In a real app, you would store the session token and redirect to the main app
        alert(`Impersonation session created. Token: ${session.token}`);
        // Redirect would happen here
      },
      error: (err) => {
        this.error = 'Failed to create impersonation session: ' + err.message;
      }
    });
  }

  toggleFeature(featureId: string, enabled: boolean): void {
    this.consoleService.toggleFeature(this.companyId, featureId, enabled).subscribe({
      next: () => {
        // Update the local features array
        const index = this.features.findIndex(f => f.feature_id === featureId);
        if (index !== -1) {
          this.features[index].enabled = enabled;
        } else {
          this.features.push({
            company_id: this.companyId,
            feature_id: featureId,
            enabled
          });
        }
      },
      error: (err) => {
        this.error = 'Failed to toggle feature: ' + err.message;
      }
    });
  }

  onFeatureToggle(featureId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (this.company) {
      this.consoleService.toggleFeature(this.company.id, featureId, checkbox.checked)
        .subscribe({
          next: (updatedFeature) => {
            const index = this.features.findIndex(f => f.feature_id === featureId);
            if (index !== -1) {
              this.features[index] = updatedFeature;
            }
          },
          error: (error) => {
            // Revert the checkbox
            checkbox.checked = !checkbox.checked;
            this.error = 'Failed to update feature: ' + error.message;
          }
        });
    }
  }

  refreshData(): void {
    this.loadCompanyData();
  }
}