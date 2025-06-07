import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { Company } from '../../../core/models/company.model';
import { finalize } from 'rxjs/operators';

type SortableFields = keyof Pick<Company, 'name' | 'email' | 'registration_number' | 'created_at' | 'updated_at'>;

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
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortField: SortableFields = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = '';

    this.companyService.getAll().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (companies: Company[]) => {
        this.companies = companies;
        this.applyFilters();
      },
      error: (error: Error) => {
        this.error = 'Failed to load companies: ' + error.message;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.companies];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(search) ||
        (company.email?.toLowerCase().includes(search) ?? false) ||
        (company.registration_number?.toLowerCase().includes(search) ?? false)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(company => company.is_active === isActive);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = this.getSortValue(a[this.sortField]);
      const bValue = this.getSortValue(b[this.sortField]);
      
      const direction = this.sortDirection === 'asc' ? 1 : -1;
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });

    this.filteredCompanies = filtered;
  }

  private getSortValue(value: any): string | number {
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      return new Date(value).getTime();
    }
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    if (value === null || value === undefined) {
      return '';
    }
    return value;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSortChange(field: SortableFields): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(field: SortableFields): string {
    if (this.sortField !== field) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  navigateToDetail(companyId: string): void {
    this.router.navigate(['/console/companies', companyId]);
  }

  navigateToEdit(companyId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/console/companies', companyId, 'edit']);
  }

  createNewCompany(): void {
    this.router.navigate(['/console/companies/new']);
  }

  refreshData(): void {
    this.loadCompanies();
  }
}