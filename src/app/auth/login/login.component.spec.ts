import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';
import { RbacService } from '../../core/services/rbac.service';
import { AuthResponse } from '@supabase/supabase-js';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let rbacServiceSpy: jasmine.SpyObj<RbacService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const rbacSpy = jasmine.createSpyObj('RbacService', ['initializeUserRole']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: RbacService, useValue: rbacSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    rbacServiceSpy = TestBed.inject(RbacService) as jasmine.SpyObj<RbacService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login admin user and navigate to /dashboard', fakeAsync(() => {
    const mockAuthResponse: AuthResponse = {
      data: {
        user: {
          id: 'user123',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: '2023-01-01',
          email: 'admin@example.com',
          role: 'authenticated',
          updated_at: '2023-01-01'
        },
        session: {
          access_token: 'token123',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'refresh123',
          user: {
            id: 'user123',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: '2023-01-01',
            email: 'admin@example.com',
            role: 'authenticated',
            updated_at: '2023-01-01'
          }
        }
      },
      error: null
    };

    authServiceSpy.login.and.returnValue(of(mockAuthResponse));
    authServiceSpy.getCurrentUser.and.returnValue({ 
      id: 'profile123',
      auth_id: 'user123',
      email: 'admin@example.com', 
      role: 'admin', 
      username: 'admin',
      company_id: 'company123'
    });
    
    component.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'password'
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin@example.com', 'password');
    expect(rbacServiceSpy.initializeUserRole).toHaveBeenCalledWith('admin-user', 'admin');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('');
  }));

  it('should login normal user and navigate to /dashboard', fakeAsync(() => {
    const mockAuthResponse: AuthResponse = {
      data: {
        user: {
          id: 'user456',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: '2023-01-01',
          email: 'user@example.com',
          role: 'authenticated',
          updated_at: '2023-01-01'
        },
        session: {
          access_token: 'token456',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'refresh456',
          user: {
            id: 'user456',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: '2023-01-01',
            email: 'user@example.com',
            role: 'authenticated',
            updated_at: '2023-01-01'
          }
        }
      },
      error: null
    };

    authServiceSpy.login.and.returnValue(of(mockAuthResponse));
    authServiceSpy.getCurrentUser.and.returnValue({ 
      id: 'profile456',
      auth_id: 'user456',
      email: 'user@example.com', 
      role: 'user', 
      username: 'user',
      company_id: 'company123'
    });
    
    component.loginForm.patchValue({
      email: 'user@example.com',
      password: 'password'
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'password');
    expect(rbacServiceSpy.initializeUserRole).toHaveBeenCalledWith('regular-user', 'user');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('');
  }));

  it('should show error message on login failure', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Username or password incorrect')));
    
    component.loginForm.patchValue({
      email: 'wrong@example.com',
      password: 'wrong'
    });

    component.onSubmit();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('Username or password incorrect');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
