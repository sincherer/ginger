import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RbacService } from '../../core/services/rbac.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private rbacService: RbacService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMsg = '';
      this.loading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          const user = this.authService.getCurrentUser();
          
          if (user) {
            // Initialize RBAC service with user's role
            if (user.role === 'admin') {
              this.rbacService.initializeUserRole('admin-user', 'admin');
            } else {
              this.rbacService.initializeUserRole('regular-user', user.role);
            }
          }
          
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.message || 'Login failed';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
