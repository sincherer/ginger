import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { RbacService } from '../../services/rbac.service';
import { Role, Permission } from '../../models/role.model';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzSwitchModule,
    NzButtonModule,
    NzMessageModule,
    NzModalModule,
    HasPermissionDirective
  ],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  permissions: Permission[] = [];
  selectedRole: Role | null = null;
  isAdmin = false;
  isCustomRoleModalVisible = false;
  newCustomRole = {
    name: '',
    description: '',
    permissions: [] as Permission[]
  };

  constructor(private rbacService: RbacService) {}

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
    this.checkAdminStatus();
  }

  private loadRoles() {
    this.roles = this.rbacService.getAllRoles();
  }

  private loadPermissions() {
    this.permissions = this.rbacService.getAllPermissions();
  }

  private checkAdminStatus() {
    this.rbacService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  selectRole(role: Role) {
    this.selectedRole = role;
  }

  togglePermission(permission: Permission, action: string) {
    if (this.selectedRole && this.selectedRole.isCustom) {
      const permissionIndex = this.selectedRole.permissions.findIndex(p => p.id === permission.id);
      if (permissionIndex > -1) {
        const actionIndex = this.selectedRole.permissions[permissionIndex].actions.indexOf(action);
        if (actionIndex > -1) {
          this.selectedRole.permissions[permissionIndex].actions.splice(actionIndex, 1);
        } else {
          this.selectedRole.permissions[permissionIndex].actions.push(action);
        }
      } else {
        this.selectedRole.permissions.push({
          ...permission,
          actions: [action]
        });
      }
      this.rbacService.updateCustomRolePermissions(this.selectedRole.id, this.selectedRole.permissions);
    }
  }

  hasPermissionForAction(permission: Permission, action: string): boolean {
    if (!this.selectedRole) return false;
    const rolePermission = this.selectedRole.permissions.find(p => p.id === permission.id);
    return rolePermission ? rolePermission.actions.includes(action) : false;
  }

  showCreateCustomRoleModal() {
    this.isCustomRoleModalVisible = true;
  }

  handleCustomRoleModalCancel() {
    this.isCustomRoleModalVisible = false;
    this.resetCustomRoleForm();
  }

  handleCustomRoleModalOk() {
    if (this.newCustomRole.name && this.newCustomRole.description) {
      const customRole = this.rbacService.createCustomRole(
        this.newCustomRole.name,
        this.newCustomRole.description,
        this.newCustomRole.permissions
      );
      this.roles = [...this.roles, customRole];
      this.isCustomRoleModalVisible = false;
      this.resetCustomRoleForm();
    }
  }

  private resetCustomRoleForm() {
    this.newCustomRole = {
      name: '',
      description: '',
      permissions: []
    };
  }
}