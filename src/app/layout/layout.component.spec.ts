import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonModule,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule
      ],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle collapse state', () => {
    expect(component.isCollapsed).toBeFalse();
    component.isCollapsed = true;
    expect(component.isCollapsed).toBeTrue();
  });

  it('should initialize with default values', () => {
    expect(component.isSettingsMode).toBeFalse();
    expect(component.showProfileMenu).toBeFalse();
    expect(component.isCollapsed).toBeFalse();
    expect(component.username).toBeDefined();
  });

  it('should toggle settings mode', () => {
    expect(component.isSettingsMode).toBeFalse();
    
    component.toggleSettingsMode();
    expect(component.isSettingsMode).toBeTrue();
    
    component.toggleSettingsMode();
    expect(component.isSettingsMode).toBeFalse();
  });

  it('should toggle profile menu', () => {
    expect(component.showProfileMenu).toBeFalse();
    
    component.toggleProfileMenu();
    expect(component.showProfileMenu).toBeTrue();
    
    component.toggleProfileMenu();
    expect(component.showProfileMenu).toBeFalse();
  });

  it('should display settings button in header', () => {
    const settingsButton = fixture.debugElement.query(By.css('button[class*="settings"]'));
    expect(settingsButton).toBeTruthy();
  });

  it('should show main menu by default', () => {
    const mainMenu = fixture.debugElement.query(By.css('ul[nz-menu]:not([ng-reflect-ng-if="true"])'));
    expect(mainMenu).toBeTruthy();
  });

  it('should show settings menu when in settings mode', () => {
    component.isSettingsMode = true;
    fixture.detectChanges();
    
    const settingsMenu = fixture.debugElement.query(By.css('ul[nz-menu]'));
    expect(settingsMenu).toBeTruthy();
  });

  it('should update sidebar header text based on mode', () => {
    // Test default state (Menu)
    let headerText = fixture.debugElement.query(By.css('.text-lg span:not([nz-icon])'));
    expect(headerText?.nativeElement?.textContent?.trim()).toBe('Menu');
    
    // Test settings mode
    component.isSettingsMode = true;
    fixture.detectChanges();
    
    headerText = fixture.debugElement.query(By.css('.text-lg span:not([nz-icon])'));
    expect(headerText?.nativeElement?.textContent?.trim()).toBe('Settings');
  });

  it('should update sidebar icon based on mode', () => {
    // Test default state (appstore icon)
    let headerIcon = fixture.debugElement.query(By.css('.text-lg span[nz-icon]'));
    expect(headerIcon?.nativeElement?.getAttribute('ng-reflect-nz-type')).toBe('appstore');
    
    // Test settings mode (setting icon)
    component.isSettingsMode = true;
    fixture.detectChanges();
    
    headerIcon = fixture.debugElement.query(By.css('.text-lg span[nz-icon]'));
    expect(headerIcon?.nativeElement?.getAttribute('ng-reflect-nz-type')).toBe('setting');
  });

  it('should apply active styles to settings button when in settings mode', () => {
    const settingsButton = fixture.debugElement.query(By.css('button'));
    
    // Initially not active
    expect(settingsButton?.nativeElement?.classList.contains('bg-blue-50')).toBeFalse();
    expect(settingsButton?.nativeElement?.classList.contains('text-blue-600')).toBeFalse();
    
    // Activate settings mode
    component.isSettingsMode = true;
    fixture.detectChanges();
    
    expect(settingsButton?.nativeElement?.classList.contains('bg-blue-50')).toBeTrue();
    expect(settingsButton?.nativeElement?.classList.contains('text-blue-600')).toBeTrue();
  });

  it('should show profile dropdown when showProfileMenu is true', () => {
    component.showProfileMenu = true;
    fixture.detectChanges();
    
    const profileDropdown = fixture.debugElement.query(By.css('.absolute.right-0'));
    expect(profileDropdown).toBeTruthy();
  });

  it('should hide profile dropdown when showProfileMenu is false', () => {
    component.showProfileMenu = false;
    fixture.detectChanges();
    
    const profileDropdown = fixture.debugElement.query(By.css('.absolute.right-0'));
    expect(profileDropdown).toBeFalsy();
  });

  it('should call logout method when logout is clicked', () => {
    spyOn(component, 'logout');
    component.showProfileMenu = true;
    fixture.detectChanges();
    
    const logoutButton = fixture.debugElement.query(By.css('a[class*="cursor-pointer"]'));
    logoutButton?.nativeElement.click();
    
    expect(component.logout).toHaveBeenCalled();
  });

  it('should toggle collapse icon based on collapse state', () => {
    // Test expanded state (menu-fold icon)
    let collapseIcon = fixture.debugElement.query(By.css('button span[nz-icon]'));
    expect(collapseIcon?.nativeElement?.getAttribute('ng-reflect-nz-type')).toBe('menu-fold');
    
    // Test collapsed state (menu-unfold icon)
    component.isCollapsed = true;
    fixture.detectChanges();
    
    collapseIcon = fixture.debugElement.query(By.css('button span[nz-icon]'));
    expect(collapseIcon?.nativeElement?.getAttribute('ng-reflect-nz-type')).toBe('menu-unfold');
  });
});