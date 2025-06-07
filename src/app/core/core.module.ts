import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Ng-Zorro Modules
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';

// Components
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

// Services
import { RbacService } from './services/rbac.service';
import { SupabaseService } from './services/supabase.service';
import { BaseDataService } from './services/base-data.service';

// Guards
import { RbacGuard } from './guards/rbac.guard';

// Directives
import { HasPermissionDirective } from './directives/has-permission.directive';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzSwitchModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzResultModule,
    RoleManagementComponent,
    UnauthorizedComponent,
    HasPermissionDirective
  ],
  exports: [
    RoleManagementComponent,
    UnauthorizedComponent,
    HasPermissionDirective
  ],
  providers: [
    RbacService,
    RbacGuard,
    SupabaseService,
    BaseDataService
  ]
})
export class CoreModule { }