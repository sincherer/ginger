import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/user.model';

interface TableHeader {
  field: keyof UserProfile | 'name';  // Using 'name' instead of 'full_name'
  label: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Users</h1>
        <div class="flex gap-4">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearchInput($event)"
              placeholder="Search users..."
              class="px-4 py-2 border rounded-lg"
            />
          </div>
          <select
            [(ngModel)]="statusFilter"
            (change)="applyFilters()"
            class="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button 
            (click)="createUser()"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add User
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                *ngFor="let header of tableHeaders"
                (click)="onSort(header.field)"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                {{ header.label }}
                <span *ngIf="sortField === header.field" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of users" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                {{ user.first_name }} {{ user.last_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ user.role }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [class]="user.is_active ? 'text-green-600' : 'text-red-600'">
                  {{user.is_active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  (click)="editUser(user.id)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4">
                  Edit
                </button>
                <button 
                  *ngIf="user.is_active"
                  (click)="deactivateUser(user.id)"
                  class="text-red-600 hover:text-red-900">
                  Deactivate
                </button>
                <button 
                  *ngIf="!user.is_active"
                  (click)="activateUser(user.id)"
                  class="text-green-600 hover:text-green-900">
                  Activate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
  `]
})
export class UserListComponent implements OnInit {
  users: UserProfile[] = [];
  loading = true;
  error: string | null = null;
  searchTerm: string = '';
  statusFilter: string = 'all';
  sortField: keyof UserProfile | 'name' = 'email';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  tableHeaders: TableHeader[] = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'role', label: 'Role' },
    { field: 'is_active', label: 'Status' }
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.loadUsers();
  }

  onSort(field: keyof UserProfile | 'name'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadUsers();
  }

  createUser(): void {
    this.router.navigate(['/console/users/new']);
  }

  editUser(id: string): void {
    this.router.navigate(['/console/users', id, 'edit']);
  }

  deactivateUser(id: string): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.userService.deactivateUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (error) => {
          console.error('Error deactivating user:', error);
          this.error = 'Failed to deactivate user. Please try again.';
        }
      });
    }
  }

  activateUser(id: string): void {
    this.userService.activateUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (error) => {
        console.error('Error activating user:', error);
        this.error = 'Failed to activate user. Please try again.';
      }
    });
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAll().subscribe({
      next: (users: UserProfile[]) => {
        this.users = users.filter(user => {
          const matchesSearchTerm = this.searchTerm === '' || 
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
          
          const matchesStatusFilter = this.statusFilter === 'all' || 
            (this.statusFilter === 'active' ? user.is_active : !user.is_active);

          return matchesSearchTerm && matchesStatusFilter;
        });

        if (this.sortField && this.sortField !== 'name') {
          this.users.sort((a, b) => {
            const aValue = a[this.sortField as keyof UserProfile];
            const bValue = b[this.sortField as keyof UserProfile];
            const compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return this.sortDirection === 'asc' ? compareResult : -compareResult;
          });
        } else if (this.sortField === 'name') {
          this.users.sort((a, b) => {
            const aName = `${a.first_name} ${a.last_name}`;
            const bName = `${b.first_name} ${b.last_name}`;
            const compareResult = aName.localeCompare(bName);
            return this.sortDirection === 'asc' ? compareResult : -compareResult;
          });
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }
}
