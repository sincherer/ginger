import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CompanyService } from '../../../core/services/company.service';
import { UserProfile, UserRegistration } from '../../../core/models/user.model';
import { Company, CompanyResponse } from '../../../core/models/company.model';

// ng-zorro imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCardModule,
    NzDividerModule,
    NzMessageModule,
    NzSpinModule,
    NzAlertModule
  ]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  isEditMode = false;
  loading = false;
  loadingUser = false;
  loadingCompanies = false;
  error: string | null = null;
  success: string | null = null;
  companies: Company[] = [];
  availableRoles = ['admin', 'manager', 'user', 'viewer'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private companyService: CompanyService,
    private message: NzMessageService
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      this.loadUser(this.userId);
    }
  }

  createUserForm(): FormGroup {
    const passwordValidators = this.isEditMode ? [] : [Validators.required, Validators.minLength(8)];
    return this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company_id: ['', Validators.required],
      role: ['user', Validators.required],
      is_active: [true],
      password: ['', passwordValidators],
      confirmPassword: ['', passwordValidators]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (!form.get('password')?.hasValidator(Validators.required)) {
      return null; // Skip validation if password is not required
    }

    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  loadUser(userId: string): void {
    this.loadingUser = true;
    this.error = null;

    this.userService.getById(userId).subscribe({
      next: (user: UserProfile) => {
        if (!user) {
          this.error = 'User not found';
          this.message.error(this.error);
          return;
        }

        this.userForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          company_id: user.company_id,
          role: user.role,
          is_active: user.is_active
        });

        // Remove password validators in edit mode
        const passwordControl = this.userForm.get('password');
        const confirmPasswordControl = this.userForm.get('confirmPassword');
        
        if (passwordControl && confirmPasswordControl) {
          passwordControl.clearValidators();
          confirmPasswordControl.clearValidators();
          passwordControl.updateValueAndValidity();
          confirmPasswordControl.updateValueAndValidity();
        }
      },
      error: (error: any) => {
        const errorMessage = error?.message || 'Failed to load user. Please try again.';
        this.error = errorMessage;
        this.message.error(errorMessage);
        console.error('Error loading user:', error);
      },
      complete: () => {
        this.loadingUser = false;
      }
    });
  }

  loadCompanies(): void {
    this.loadingCompanies = true;

    this.companyService.getAll().pipe(
      finalize(() => this.loadingCompanies = false)
    ).subscribe({
      next: (companies: Company[]) => {
        this.companies = companies.filter(company => company.is_active);
      },
      error: (error: any) => {
        const errorMessage = error?.message || 'Failed to load companies. Please try again.';
        console.error('Error loading companies:', error);
        this.message.error(errorMessage);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const userData = this.prepareUserData();

    if (this.isEditMode && this.userId) {
      this.updateUser(this.userId, userData as Partial<UserProfile>);
    } else {
      this.createUser(userData as UserRegistration);
    }
  }

  prepareUserData(): UserRegistration | Partial<UserProfile> {
    const formData = this.userForm.value;
    const userData: UserRegistration | Partial<UserProfile> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      company_id: formData.company_id,
      role: formData.role,
      is_active: formData.is_active
    };

    // Only include password in new user creation
    if (!this.isEditMode && formData.password) {
      (userData as UserRegistration).password = formData.password;
    }

    return userData;
  }

  async createUser(userData: UserRegistration): Promise<void> {
    try {
      const { data, error } = await this.userService.createUser(userData);
      
      if (error) {
        throw error;
      }

      if (data) {
        this.message.success('User created successfully!');
        setTimeout(() => {
          this.router.navigate(['/console/users', data.id]);
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create user. Please try again.';
      this.error = errorMessage;
      this.message.error(errorMessage);
      console.error('Error creating user:', err);
    } finally {
      this.loading = false;
    }
  }

  updateUser(userId: string, userData: Partial<UserProfile>): void {
    this.userService.updateUserProfile(userId, userData).subscribe({
      next: (response) => {
        if (response) {
          this.message.success('User updated successfully!');
          setTimeout(() => {
            this.router.navigate(['/console/users', userId]);
          }, 1500);
        }
      },
      error: (err) => {
        const errorMessage = err?.message || 'Failed to update user. Please try again.';
        this.error = errorMessage;
        this.message.error(errorMessage);
        console.error('Error updating user:', err);
      },
      complete: () => {
        this.loading = false;
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
}