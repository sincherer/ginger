import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConsoleService } from '../../services/console.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-user-invitation-form',
  templateUrl: './user-invitation-form.component.html',
  styleUrls: ['./user-invitation-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class UserInvitationFormComponent implements OnInit {
  invitationForm: FormGroup;
  loading = false;
  loadingCompanies = false;
  error: string | null = null;
  success: string | null = null;
  companies: Company[] = [];
  availableRoles = ['Admin', 'Manager', 'User', 'Viewer'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private consoleService: ConsoleService
  ) {
    this.invitationForm = this.createInvitationForm();
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  createInvitationForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      companyId: ['', Validators.required],
      role: ['User', Validators.required],
      message: [''],
      sendCopy: [false]
    });
  }

  loadCompanies(): void {
    this.loadingCompanies = true;

    this.consoleService.getCompanies().subscribe({
      next: (companies: Company[]) => {
        this.companies = companies.filter(company => company.is_active);
        this.loadingCompanies = false;
      },
      error: (error: Error) => {
        console.error('Error loading companies:', error);
        this.loadingCompanies = false;
      }
    });
  }

  onSubmit(): void {
    if (this.invitationForm.invalid) {
      this.markFormGroupTouched(this.invitationForm);
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const invitationData = this.invitationForm.value;

    this.consoleService.inviteUser(invitationData).subscribe({
      next: () => {
        this.success = 'Invitation sent successfully!';
        this.loading = false;
        
        // Reset form after successful submission
        this.invitationForm.reset({
          role: 'User',
          sendCopy: false
        });
        
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          this.router.navigate(['/console/users']);
        }, 2000);
      },
      error: (error: Error) => {
        this.error = 'Failed to send invitation. Please try again.';
        this.loading = false;
        console.error('Error sending invitation:', error);
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/console/users']);
  }

  getCompanyName(companyId: string): string {
    const company = this.companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
  }
}