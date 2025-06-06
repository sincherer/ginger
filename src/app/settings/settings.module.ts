import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Routes
import { SETTINGS_ROUTES } from './settings.routes';

// Components
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { CompanySettingsComponent } from './components/company-settings/company-settings.component';

// NG-ZORRO Modules
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(SETTINGS_ROUTES),
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzTabsModule,
    NzUploadModule,
    NzMessageModule,
    NzDividerModule,
    NzIconModule,
    NzCheckboxModule,
    
    // Standalone Components
    ProfileSettingsComponent,
    CompanySettingsComponent
  ],
  exports: []
})
export class SettingsModule { }