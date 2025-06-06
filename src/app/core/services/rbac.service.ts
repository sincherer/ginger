import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission, Role, UserRole, DEFAULT_ROLES, DEFAULT_PERMISSIONS } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  private currentUserRole = new BehaviorSubject<Role | null>(null);
  private currentUserPermissions = new BehaviorSubject<Permission[]>([]);

  constructor() {}

  // Initialize user's role and permissions
  initializeUserRole(userId: string, roleId: string, customPermissions?: Permission[]) {
    const role = this.getRoleById(roleId);
    if (role) {
      this.currentUserRole.next(role);
      const permissions = role.isCustom && customPermissions ? 
        customPermissions : role.permissions;
      this.currentUserPermissions.next(permissions);
    }
  }

  // Get role by ID
  getRoleById(roleId: string): Role | null {
    return DEFAULT_ROLES.find(role => role.id === roleId) || null;
  }

  // Get all available roles
  getAllRoles(): Role[] {
    return DEFAULT_ROLES;
  }

  // Get all available permissions
  getAllPermissions(): Permission[] {
    return DEFAULT_PERMISSIONS;
  }

  // Get current user's role
  getCurrentRole(): Observable<Role | null> {
    return this.currentUserRole.asObservable();
  }

  // Get current user's permissions
  getCurrentPermissions(): Observable<Permission[]> {
    return this.currentUserPermissions.asObservable();
  }

  // Check if user has specific permission
  hasPermission(moduleId: string, action: string): Observable<boolean> {
    return this.getCurrentPermissions().pipe(
      map(permissions => {
        const permission = permissions.find(p => p.id === moduleId);
        return permission ? permission.actions.includes(action) : false;
      })
    );
  }

  // Create custom role
  createCustomRole(name: string, description: string, permissions: Permission[]): Role {
    const customRole: Role = {
      id: `custom-${Date.now()}`,
      name,
      description,
      isCustom: true,
      permissions
    };
    return customRole;
  }

  // Update permissions for custom role
  updateCustomRolePermissions(roleId: string, permissions: Permission[]) {
    const currentRole = this.currentUserRole.value;
    if (currentRole && currentRole.id === roleId && currentRole.isCustom) {
      this.currentUserPermissions.next(permissions);
    }
  }

  // Check if user is admin
  isAdmin(): Observable<boolean> {
    return this.getCurrentRole().pipe(
      map(role => role?.id === 'admin')
    );
  }

  // Get permissions by module
  getPermissionsByModule(moduleId: string): Observable<Permission | null> {
    return this.getCurrentPermissions().pipe(
      map(permissions => permissions.find(p => p.id === moduleId) || null)
    );
  }
}