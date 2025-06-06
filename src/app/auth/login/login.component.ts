import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth.service';
import { RbacService } from '../../core/services/rbac.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username : string = '';
  password: string = '';
  loading = false;
  errorMsg = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private rbacService: RbacService
  ) {}

  onSubmit() {
    this.errorMsg = '';
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (user: User) => {
        this.loading = false;
        
        // Initialize RBAC service with user's role
        // For admin users, use the admin role ID which has all permissions
        if (user.role === 'admin') {
          this.rbacService.initializeUserRole('admin-user', 'admin');
        } else {
          // For regular users, assign a more restricted role
          this.rbacService.initializeUserRole('regular-user', 'sales');
        }
        
        // Navigate to dashboard regardless of role
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.message || 'Login failed';
      }
    });
  }
}
