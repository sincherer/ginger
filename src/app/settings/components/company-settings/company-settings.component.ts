import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  website: string;
}

interface PrintSettings {
  headerText: string;
  footerText: string;
  showLogo: boolean;
  showAddress: boolean;
  showContact: boolean;
}

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzTabsModule,
    NzUploadModule,
    NzMessageModule,
    NzDividerModule,
    NzIconModule,
    NzCheckboxModule
  ]
})
export class CompanySettingsComponent implements OnInit {
  companyForm!: FormGroup;
  printSettingsForm!: FormGroup;
  logoFile: NzUploadFile[] = [];
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForms();
    // In a real app, you would load saved settings from a service
    this.loadSavedSettings();
  }

  initForms(): void {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      taxId: [''],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]]
    });

    this.printSettingsForm = this.fb.group({
      headerText: [''],
      footerText: [''],
      showLogo: [true],
      showAddress: [true],
      showContact: [true]
    });
  }

  loadSavedSettings(): void {
    // Mock data - in a real app, this would come from a service
    const savedCompanyInfo: CompanyInfo = {
      name: 'Ginger ERP Solutions',
      address: '123 Business Ave, Suite 100, Business City, BC 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@gingererp.com',
      taxId: 'TAX-123456789',
      website: 'https://gingererp.com'
    };

    const savedPrintSettings: PrintSettings = {
      headerText: 'Ginger ERP - Official Invoice',
      footerText: 'Thank you for your business!',
      showLogo: true,
      showAddress: true,
      showContact: true
    };

    this.companyForm.patchValue(savedCompanyInfo);
    this.printSettingsForm.patchValue(savedPrintSettings);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // Check file type
    const isImage = file.type?.startsWith('image/');
    if (!isImage) {
      this.message.error('You can only upload image files!');
      return false;
    }
    
    // Check file size
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must be smaller than 2MB!');
      return false;
    }
    
    // Update file list
    this.logoFile = [file];
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logoPreview = e.target.result;
    };
    reader.readAsDataURL(file as any);
    
    return false; // Prevent auto upload
  };

  saveCompanyInfo(): void {
    if (this.companyForm.valid) {
      // In a real app, you would save to a service/API
      console.log('Company info saved:', this.companyForm.value);
      this.message.success('Company information saved successfully!');
    } else {
      Object.values(this.companyForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('Please fix the errors in the form!');
    }
  }

  savePrintSettings(): void {
    if (this.printSettingsForm.valid) {
      // In a real app, you would save to a service/API
      console.log('Print settings saved:', this.printSettingsForm.value);
      this.message.success('Print settings saved successfully!');
    }
  }

  uploadLogo(): void {
    if (this.logoFile.length > 0) {
      // In a real app, you would upload to a server
      console.log('Logo uploaded:', this.logoFile[0]);
      this.message.success('Logo uploaded successfully!');
    } else {
      this.message.warning('Please select a logo file first!');
    }
  }
}