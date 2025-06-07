import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConsoleService } from '../../services/console.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  statusFilter = 'all'; // 'all', 'active', 'inactive'
  sortField = 'name';
  sortDirection = 'asc';

  constructor(
    private consoleService: ConsoleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = '';

    this.consoleService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load companies: ' + err.message;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.companies];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(company => company.active === isActive);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(search) ||
        company.email.toLowerCase().includes(search) ||
        (company.taxId && company.taxId.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortField as keyof Company];
      let bValue: any = b[this.sortField as keyof Company];

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }

      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Compare values
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredCompanies = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSortChange(field: string): void {
    if (this.sortField === field) {
      // Toggle direction if same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending for new field
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  navigateToDetail(companyId: string): void {
    this.router.navigate(['/console/companies', companyId]);
  }

  navigateToEdit(companyId: string, event: Event): void {
    event.stopPropagation(); // Prevent row click event
    this.router.navigate(['/console/companies', companyId, 'edit']);
  }

  createNewCompany(): void {
    this.router.navigate(['/console/companies/new']);
  }

  refreshData(): void {
    this.loadCompanies();
  }
}