import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthResponse, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  get client() {
    return this.supabase;
  }

  // Auth methods
  async signIn(email: string, password: string): Promise<AuthResponse> {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  // Database methods
  async select(table: string, query: any = {}) {
    return await this.supabase
      .from(table)
      .select(query.select || '*')
      .match(query.match || {});
  }

  async insert(table: string, data: any) {
    return await this.supabase
      .from(table)
      .insert(data);
  }

  async update(table: string, data: any, match: any) {
    return await this.supabase
      .from(table)
      .update(data)
      .match(match);
  }

  async delete(table: string, match: any) {
    return await this.supabase
      .from(table)
      .delete()
      .match(match);
  }
}
