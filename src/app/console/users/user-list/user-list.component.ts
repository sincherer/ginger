import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../core/services/user.service';
import { CompanyService } from '../../../core/services/company.service';
import { ConsoleUser, UserInvitation } from '../../models/user.model';
import { ConsoleService } from '../../services/console.service';
import { finalize } from 'rxjs/operators';

interface CompanyInfo {
  id: string;
  name: string;
}

interface UserListItem extends ConsoleUser {
  company?: CompanyInfo;
  display_name?: string;
}

interface InvitationListItem extends UserInvitation {
  company?: CompanyInfo;
}

interface TableHeader {
  field: keyof UserListItem | 'display_name';
  label: string;
  sortKey?: keyof UserListItem;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: UserListItem[] = [];
  filteredUsers: UserListItem[] = [];
  invitations: InvitationListItem[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortField: keyof UserListItem = 'email';
  sortDirection: 'asc' | 'desc' = 'asc';
  company_id: string = '';

  tableHeaders: TableHeader[] = [
    { field: 'display_name', label: 'Name', sortKey: 'first_name' },
    { field: 'email', label: 'Email' },
    { field: 'company_id', label: 'Company' },
    { field: 'role', label: 'Role' },
    { field: 'last_login', label: 'Last Login' },
    { field: 'is_active', label: 'Status' }
  ];

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private consoleService: ConsoleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.company_id = currentUser.company_id || '';
    }
    this.loadUsers();
    this.loadInvitations();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.consoleService.getUsersByCompany(this.company_id).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (users: ConsoleUser[]) => {
        // Transform ConsoleUser to UserListItem with company info
        this.users = users.map(user => ({
          ...user,
          company: undefined // Will be populated when company data is loaded
        }));
        
        // Load company data for each user
        this.users.forEach(user => {
          this.companyService.getById(user.company_id).subscribe(company => {
            user.company = {
              id: company.id,
              name: company.name
            };
          });
        });
        
        this.applyFilters();
      },
      error: (error: Error) => {
        this.error = 'Failed to load users. Please try again.';
        console.error('Error loading users:', error);
      }
    });
  }

  loadInvitations(): void {
    this.consoleService.getInvitationsByCompany(this.company_id).subscribe({
      next: (invitations: UserInvitation[]) => {
        // Transform UserInvitation to InvitationListItem with company info
        this.invitations = invitations.map(invitation => ({
          ...invitation,
          company: undefined,
          role: invitation.role_id
        }));

        // Load company data for each invitation
        this.invitations.forEach(invitation => {
          if (invitation.company_id) {
            this.companyService.getById(invitation.company_id).subscribe(company => {
              invitation.company = {
                id: company.id,
                name: company.name
              };
            });
          }
        });
      },
      error: (error: Error) => {
        console.error('Error loading invitations:', error);
      }
    });
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onStatusChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSort(field: keyof UserListItem | 'display_name'): void {
    const header = this.tableHeaders.find(h => h.field === field);
    const sortKey = header?.sortKey || field as keyof UserListItem;
    
    if (this.sortField === sortKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = sortKey;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }

  getSortIcon(field: keyof UserListItem): string {
    if (field !== this.sortField) {
      return 'unfold_more';
    }
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const nameMatch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const companyMatch = user.company?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || false;
      const statusMatch = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' ? user.is_active : !user.is_active);

      return (nameMatch || emailMatch || companyMatch) && statusMatch;
    });

    // Apply sorting
    this.filteredUsers.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (this.sortField === 'first_name') {
        aValue = `${a.first_name} ${a.last_name}`;
        bValue = `${b.first_name} ${b.last_name}`;
      } else {
        aValue = a[this.sortField];
        bValue = b[this.sortField];
      }

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  refreshUsers(): void {
    this.loadUsers();
    this.loadInvitations();
  }

  viewUser(userId: string): void {
    this.router.navigate(['/console/users', userId]);
  }

  editUser(userId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/console/users', userId, 'edit']);
  }

  impersonateUser(userId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (!this.company_id) {
      alert('Authentication error');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Authentication error');
      return;
    }

    this.consoleService.createImpersonationSession(currentUser.id, userId, this.company_id).subscribe({
      next: (session) => {
        localStorage.setItem('impersonation_token', session.token);
        window.location.reload();
      },
      error: (error) => {
        console.error('Error creating impersonation session:', error);
        alert('Failed to create impersonation session');
      }
    });
  }

  createUser(): void {
    this.router.navigate(['/console/users/new']);
  }

  inviteUser(): void {
    this.router.navigate(['/console/users/invite']);
  }

  getInitials(firstName: string = '', lastName: string = ''): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }
}