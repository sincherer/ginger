import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { BaseDataService } from './base-data.service';
import { UserProfile, UserRegistration } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseDataService<UserProfile> {
  constructor(supabase: SupabaseService) {
    super(supabase, 'user_profiles');
  }

  async createUser(userData: UserRegistration): Promise<{ data: any; error: any }> {
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await this.supabase.signUp(
        userData.email,
        userData.password
      );

      if (authError) throw authError;

      // Then create the user profile
      const profile: Partial<UserProfile> = {
        auth_id: authData.user!.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        company_id: userData.company_id,
        is_active: true
      };

      const { data: profileData, error: profileError } = await this.supabase.insert(
        this.tableName,
        profile
      );

      if (profileError) throw profileError;

      return { data: profileData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  getUsersByCompany(companyId: string): Observable<UserProfile[]> {
    return from(
      this.supabase.select(this.tableName, {
        match: { company_id: companyId }
      })
    ).pipe(
      map((response: any) => response.data)
    );
  }

  updateUserProfile(id: string, data: Partial<UserProfile>): Observable<UserProfile> {
    return from(
      this.supabase.update(this.tableName, data, { id })
    ).pipe(
      map((response: any) => response.data[0])
    );
  }

  deactivateUser(id: string): Observable<UserProfile> {
    return this.updateUserProfile(id, { is_active: false });
  }

  activateUser(id: string): Observable<UserProfile> {
    return this.updateUserProfile(id, { is_active: true });
  }
}
