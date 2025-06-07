import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConsoleService } from '../services/console.service';
import { Router } from '@angular/router';
import { Company } from '../models/company.model';
import { ConsoleUser, UserInvitation, InvitationStatus } from '../models/user.model';
import { BillingCycle } from '../models/billing.model';
import { FindPipe } from '../../core/pipes/find.pipe';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-console-dashboard',
  templateUrl: './console-dashboard.component.html',
  styleUrls: ['./console-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FindPipe]
})
export class ConsoleDashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  companies: Company[] = [];
  recentUsers: ConsoleUser[] = [];
  upcomingRenewals: BillingCycle[] = [];
  activeCompanies = 0;
  totalUsers = 0;
  pendingInvitations = 0;

  constructor(
    private consoleService: ConsoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load all data in parallel
    forkJoin({
      companies: this.consoleService.getCompanies(),
      users: this.consoleService.getUsers(),
      billingCycle: this.consoleService.getCompanyBillingCycle('all'),
      invitations: this.consoleService.getInvitationsByCompany('all')
    }).subscribe({
      next: (data) => {
        // Process companies
        this.companies = data.companies;
        this.activeCompanies = data.companies.filter(c => c.is_active).length;
        
        // Process users
        this.recentUsers = data.users.slice(0, 5);
        this.totalUsers = data.users.length;
        
        // Process billing cycles
        if (data.billingCycle) {
          const now = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(now.getDate() + 30);
          
          this.upcomingRenewals = [data.billingCycle].filter(cycle => {
            const renewalDate = new Date(cycle.renewal_date);
            return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
          });
        }
        
        // Process invitations
        this.pendingInvitations = data.invitations.filter(i => i.status === InvitationStatus.PENDING).length;
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}