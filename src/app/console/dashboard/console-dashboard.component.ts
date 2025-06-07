import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConsoleService } from '../services/console.service';
import { Company } from '../models/company.model';
import { ConsoleUser } from '../models/user.model';
import { BillingCycle } from '../models/billing.model';

@Component({
  selector: 'app-console-dashboard',
  templateUrl: './console-dashboard.component.html',
  styleUrls: ['./console-dashboard.component.scss']
})
export class ConsoleDashboardComponent implements OnInit {
  companies: Company[] = [];
  recentUsers: ConsoleUser[] = [];
  upcomingRenewals: BillingCycle[] = [];
  pendingInvitations = 0;
  activeCompanies = 0;
  totalUsers = 0;
  loading = true;
  error = '';

  constructor(
    private consoleService: ConsoleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Get companies
    this.consoleService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.activeCompanies = companies.filter(c => c.active).length;
        
        // Get recent users (simplified for demo)
        this.consoleService.getUsers().subscribe({
          next: (users) => {
            this.totalUsers = users.length;
            // Sort by creation date and take the 5 most recent
            this.recentUsers = users
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5);
            
            // Get upcoming renewals
            // In a real app, you would filter billing cycles by upcoming renewal dates
            // For demo purposes, we'll just take all billing cycles
            this.loadBillingData();
          },
          error: (err) => {
            this.error = 'Failed to load users: ' + err.message;
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load companies: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadBillingData(): void {
    // For demo purposes, we'll create a mock billing cycle for each company
    this.upcomingRenewals = [];
    let pendingInvitationsCount = 0;

    // Count pending invitations across all companies
    const invitationPromises = this.companies.map(company => {
      return this.consoleService.getInvitationsByCompany(company.id).toPromise();
    });

    // Get billing cycles for all companies
    const billingPromises = this.companies.map(company => {
      return this.consoleService.getCompanyBillingCycle(company.id).toPromise();
    });

    // Wait for all promises to resolve
    Promise.all(invitationPromises)
      .then(invitationResults => {
        invitationResults.forEach(invitations => {
          if (invitations) {
            pendingInvitationsCount += invitations.filter(i => i.status === 'pending').length;
          }
        });
        this.pendingInvitations = pendingInvitationsCount;

        return Promise.all(billingPromises);
      })
      .then(billingResults => {
        billingResults.forEach(billingCycle => {
          if (billingCycle) {
            this.upcomingRenewals.push(billingCycle);
          }
        });

        // Sort by renewal date
        this.upcomingRenewals.sort((a, b) => 
          new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
        
        this.loading = false;
      })
      .catch(err => {
        this.error = 'Failed to load dashboard data: ' + err.message;
        this.loading = false;
      });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}