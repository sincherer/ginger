import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupComponent } from './signup.component';
import { AuthService } from '../auth.service';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signup form', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.controls['username']).toBeDefined();
    expect(component.signupForm.controls['email']).toBeDefined();
    expect(component.signupForm.controls['password']).toBeDefined();
    expect(component.signupForm.controls['confirmPassword']).toBeDefined();
  });

  it('should make the form invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should make the form invalid if passwords do not match', () => {
    component.signupForm.controls['username'].setValue('testuser');
    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password456');
    expect(component.signupForm.valid).toBeFalsy();
    expect(component.signupForm.errors?.['passwordMismatch']).toBeTrue();
  });

  it('should make the form valid when all fields are filled correctly', () => {
    component.signupForm.controls['username'].setValue('testuser');
    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password123');
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should not call authService.register if the form is invalid', async () => {
    await component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call authService.register on submit with valid form data', async () => {
    // FIX 1: Make the mock response match the real return type by adding `session`.
    // Using `as any` for the user is a common shortcut in tests to avoid mocking the entire complex object.
    const mockResponse = {
      data: { user: { id: '123' } as SupabaseUser, session: null as Session | null },
      error: null
    };
    authServiceSpy.register.and.resolveTo(mockResponse);

    component.signupForm.controls['username'].setValue('testuser');
    // FIX 2: Corrected the typo from `signup_form` to `signupForm`.
    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password123');

    await component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should set success message and disable form on successful registration', async () => {
    // FIX 3: Apply the same fix to this mock response.
    const mockResponse = {
      data: { user: { id: '123' } as SupabaseUser, session: null as Session | null },
      error: null
    };
    authServiceSpy.register.and.resolveTo(mockResponse);

    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password123');
    component.signupForm.controls['username'].setValue('testuser');

    await component.onSubmit();

    expect(component.successMsg).toContain('Registration successful!');
    expect(component.errorMsg).toBe('');
    expect(component.signupForm.disabled).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should set error message on failed registration', async () => {
    const error = { message: 'Email already in use', name: 'AuthApiError', status: 400 };
    // The `register` method now returns an object, so we mock that structure.
    authServiceSpy.register.and.resolveTo({ data: null, error });

    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password123');
    component.signupForm.controls['username'].setValue('testuser');

    await component.onSubmit();

    expect(component.errorMsg).toBe('Email already in use');
    expect(component.successMsg).toBe('');
    expect(component.signupForm.disabled).toBeFalse();
    expect(component.loading).toBeFalse();
  });
});