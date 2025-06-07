import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConsoleService } from '../../services/console.service';
import { ConsoleUser } from '../../models/user.model';
import type { Company } from '../../models/company.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class UserDetailComponent implements OnInit {
  userId: string | null = null;
  user: ConsoleUser | null = null;
  companies: Company[] = [];
  loading = true;
  error: string | null = null;
  activeTab = 'overview'; // 'overview', 'sessions', 'activity'
  sessions: any[] = [];
  activityLogs: any[] = [];
  loadingSessions = false;
  loadingActivity = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consoleService: ConsoleService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadUser(this.userId);
    } else {
      this.error = 'User ID not provided';
      this.loading = false;
    }
  }

  loadUser(userId: string): void {
    this.loading = true;
    this.error = null;

    this.consoleService.getUserById(userId).subscribe(
      (user) => {
        this.user = user;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load user. Please try again.';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    );
  }

  refreshUser(): void {
    if (this.userId) {
      this.loadUser(this.userId);
      if (this.activeTab === 'sessions') {
        this.loadSessions();
      } else if (this.activeTab === 'activity') {
        this.loadActivity();
      }
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;

    if (tab === 'sessions' && this.userId && this.sessions.length === 0) {
      this.loadSessions();
    } else if (tab === 'activity' && this.userId && this.activityLogs.length === 0) {
      this.loadActivity();
    }
  }

  loadSessions(): void {
    if (!this.userId) return;

    this.loadingSessions = true;
    // In a real app, this would load actual session data
    // Simulating API call with timeout
    setTimeout(() => {
      this.sessions = [
        {
          id: 'sess-1',
          startTime: new Date(Date.now() - 3600000).toISOString(),
          endTime: null,
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          active: true
        },
        {
          id: 'sess-2',
          startTime: new Date(Date.now() - 86400000).toISOString(),
          endTime: new Date(Date.now() - 82800000).toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          active: false
        }
      ];
      this.loadingSessions = false;
    }, 1000);
  }

  loadActivity(): void {
    if (!this.userId) return;

    this.loadingActivity = true;
    // In a real app, this would load actual activity data
    // Simulating API call with timeout
    setTimeout(() => {
      this.activityLogs = [
        {
          id: 'act-1',
          action: 'Login',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'User logged in successfully',
          ipAddress: '192.168.1.1'
        },
        {
          id: 'act-2',
          action: 'Profile Update',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'User updated their profile information',
          ipAddress: '192.168.1.1'
        },
        {
          id: 'act-3',
          action: 'Password Change',
          timestamp: new Date(Date.now() - 604800000).toISOString(),
          details: 'User changed their password',
          ipAddress: '192.168.1.1'
        }
      ];
      this.loadingActivity = false;
    }, 1000);
  }

  editUser(): void {
    if (this.userId) {
      this.router.navigate(['/console/users', this.userId, 'edit']);
    }
  }

  impersonateUser(): void {
    if (!this.userId || !this.user?.company_id) return;

    const adminId = this.consoleService.getCurrentUserId();
    if (!adminId) return;

    this.consoleService.createImpersonationSession(adminId, this.userId, this.user.company_id).subscribe({
      next: (session) => {
        // Handle successful impersonation
        window.location.href = '/dashboard'; // Redirect to dashboard with new session
      },
      error: (error: Error) => {
        console.error('Error creating impersonation session:', error);
        this.error = 'Failed to start impersonation session';
      }
    });
  }

  terminateSession(sessionId: string): void {
    // In a real app, this would call an API to terminate the session
    alert(`Session ${sessionId} would be terminated in a real app`);
    this.sessions = this.sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          active: false,
          endTime: new Date().toISOString()
        };
      }
      return session;
    });
  }

  terminateAllSessions(): void {
    // In a real app, this would call an API to terminate all sessions
    alert('All sessions would be terminated in a real app');
    this.sessions = this.sessions.map(session => ({
      ...session,
      active: false,
      endTime: session.endTime || new Date().toISOString()
    }));
  }

  getInitials(firstName: string = '', lastName: string = ''): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  formatDate(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  formatDateShort(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getCompanyName(): string {
    const company = this.companies.find(c => c.id === this.user?.company_id);
    return company?.name || 'N/A';
  }

  getStatusClass(): string {
    return this.user?.is_active ? 'active' : 'inactive';
  }

  getStatusText(): string {
    return this.user?.is_active ? 'Active' : 'Inactive';
  }
}