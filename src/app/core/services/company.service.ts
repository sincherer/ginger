import { Injectable } from '@angular/core';
import { BaseDataService } from './base-data.service';
import { SupabaseService } from './supabase.service';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseDataService<Company> {
  constructor(supabase: SupabaseService) {
    super(supabase, 'companies');
  }
}
