import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

// Custom validator function to check if passwords match
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.pristine || confirmPassword?.pristine) {
    return null;
  }

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      // Your user_profiles table has a username column
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      // Add the custom validator to the form group
      validators: passwordMatchValidator
    });
  }

  async onSubmit(): Promise<void> {
    // Mark all fields as touched to trigger validation messages
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    
    const { email, password } = this.signupForm.value;

    try {
      const { data, error } = await this.authService.register(email, password);

      if (error) {
        throw error;
      }

      // Supabase sends a confirmation email by default.
      // It's good practice to inform the user.
      this.successMsg = 'Registration successful! Please check your email to confirm your account.';
      this.signupForm.disable(); // Disable form on success

    } catch (err: any) {
      this.errorMsg = err.message || 'An unexpected error occurred during registration.';
    } finally {
      this.loading = false;
    }
  }
}