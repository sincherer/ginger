import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConsoleService } from '../../services/console.service';
import { Company, BillingPlan } from '../../models/company.model';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  companyForm: FormGroup;
  companyId: string | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  error = '';
  successMessage = '';
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private consoleService: ConsoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.companyForm = this.createCompanyForm();
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.companyId;

    if (this.isEditMode && this.companyId) {
      this.loadCompanyData(this.companyId);
    }
  }

  createCompanyForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.maxLength(20)],
      address: ['', Validators.maxLength(200)],
      taxId: ['', Validators.maxLength(50)],
      website: ['', Validators.maxLength(100)],
      logo: [''],
      active: [true]
    });
  }

  loadCompanyData(id: string): void {
    this.loading = true;
    this.error = '';

    this.consoleService.getCompanyById(id).subscribe({
      next: (company) => {
        this.companyForm.patchValue({
          name: company.name,
          email: company.email,
          phone: company.phone,
          address: company.address,
          taxId: company.taxId,
          website: company.website,
          logo: company.logo,
          active: company.active
        });

        if (company.logo) {
          this.logoPreview = company.logo;
        }

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load company data: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.markFormGroupTouched(this.companyForm);
      return;
    }

    this.submitting = true;
    this.error = '';
    this.successMessage = '';

    const companyData = this.companyForm.value;

    if (this.isEditMode && this.companyId) {
      this.consoleService.updateCompany(this.companyId, companyData).subscribe({
        next: (company) => {
          this.submitting = false;
          this.successMessage = 'Company updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/console/companies', company.id]);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Failed to update company: ' + err.message;
          this.submitting = false;
        }
      });
    } else {
      this.consoleService.createCompany(companyData).subscribe({
        next: (company) => {
          this.submitting = false;
          this.successMessage = 'Company created successfully!';
          
          // Create initial billing cycle with free plan
          this.consoleService.createBillingCycle({
            companyId: company.id,
            plan: BillingPlan.FREE
          }).subscribe();

          setTimeout(() => {
            this.router.navigate(['/console/companies', company.id]);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Failed to create company: ' + err.message;
          this.submitting = false;
        }
      });
    }
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check file type and size
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|svg\+xml)/)) {
        this.error = 'Invalid file type. Please upload an image file.';
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.error = 'File size exceeds 2MB limit.';
        return;
      }

      // Read file as data URL
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
        this.companyForm.patchValue({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.logoPreview = null;
    this.companyForm.patchValue({ logo: '' });
  }

  cancel(): void {
    if (this.isEditMode && this.companyId) {
      this.router.navigate(['/console/companies', this.companyId]);
    } else {
      this.router.navigate(['/console/companies']);
    }
  }

  // Helper method to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}