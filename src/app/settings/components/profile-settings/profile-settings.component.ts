import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService, User } from '../../../auth/auth.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzTabsModule,
    NzMessageModule,
    NzDividerModule,
    NzIconModule
  ]
})
export class ProfileSettingsComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }], // Username is typically not changeable
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9\\-\\+\\(\\)\\s]+$')]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { 'mismatch': true };
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser) {
      // In a real app, you would load more user data from a service
      // For now, we'll just use the username from auth service
      this.profileForm.patchValue({
        username: this.currentUser.username,
        displayName: this.currentUser.username, // Mock data
        email: `${this.currentUser.username}@example.com`, // Mock data
        phone: '+1 (555) 123-4567' // Mock data
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      // In a real app, you would save to a service/API
      console.log('Profile saved:', this.profileForm.value);
      this.message.success('Profile information saved successfully!');
    } else {
      Object.values(this.profileForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('Please fix the errors in the form!');
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      // In a real app, you would verify the current password and update to the new one
      if (this.passwordForm.value.currentPassword !== 'password') { // Mock validation
        this.message.error('Current password is incorrect!');
        return;
      }
      
      console.log('Password changed');
      this.message.success('Password changed successfully!');
      this.passwordForm.reset();
    } else {
      Object.values(this.passwordForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      
      if (this.passwordForm.hasError('mismatch')) {
        this.message.error('New password and confirm password do not match!');
      } else {
        this.message.error('Please fix the errors in the form!');
      }
    }
  }
}