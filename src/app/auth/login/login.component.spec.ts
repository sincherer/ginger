import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login admin user and navigate to /admin-dashboard', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of({ username: 'admin', role: 'admin' }));
    component.username = 'admin';
    component.password = 'password';

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin', 'password');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('');
  }));

  it('should login normal user and navigate to /user-dashboard', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of({ username: 'user', role: 'user' }));
    component.username = 'user';
    component.password = 'password';

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('user', 'password');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-dashboard']);
    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('');
  }));

  it('should show error message on login failure', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('用户名或密码错误')));
    component.username = 'wrong';
    component.password = 'wrong';

    component.onSubmit();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.errorMsg).toBe('用户名或密码错误');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
