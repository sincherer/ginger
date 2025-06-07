import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SupabaseService } from '../core/services/supabase.service';
import { AuthResponse, Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  auth_id: string;
  email: string;
  role: string;
  username: string;
  company_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    // Check initial auth state
    this.supabase.client.auth.onAuthStateChange(async (event, session) => {
      this.isAuthenticated.next(!!session);
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await this.supabase.client
            .from('user_profiles')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          if (profileError) throw profileError;

          this.currentUser.next({
            id: profile.id,
            auth_id: session.user.id,
            email: session.user.email!,
            role: profile.role || 'user',
            username: profile.username || session.user.email!.split('@')[0],
            company_id: profile.company_id
          });
        } catch (error) {
          console.error('Error loading user profile:', error);
          this.currentUser.next(null);
          this.isAuthenticated.next(false);
          await this.router.navigate(['/auth/login']);
        }
      } else {
        this.currentUser.next(null);
      }
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return from(this.supabase.signIn(email, password)).pipe(
      map(response => {
        if (response.error) throw response.error;
        if (!response.data.user || !response.data.session) {
          throw new Error('Login failed');
        }
        return response;
      })
    );
  }

  async register(email: string, password: string, role: string = 'user') {
    try {
      const response = await this.supabase.signUp(email, password);
      if (response.error) throw response.error;
      if (!response.data.user) throw new Error('Registration failed');

      // Create user profile
      const { error: profileError } = await this.supabase.client
        .from('user_profiles')
        .insert([
          {
            auth_id: response.data.user.id,
            email: response.data.user.email,
            username: response.data.user.email?.split('@')[0],
            role
          }
        ]);
      
      if (profileError) throw profileError;
      
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async logout() {
    const { error } = await this.supabase.signOut();
    if (!error) {
      this.currentUser.next(null);
      this.isAuthenticated.next(false);
      await this.router.navigate(['/auth/login']);
    }
    return { error };
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }
}
