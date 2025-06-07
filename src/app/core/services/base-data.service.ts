import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PostgrestResponse, PostgrestSingleResponse, PostgrestError } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { TABLE_NAME } from './table-name.token';

@Injectable({
  providedIn: 'root'
})
export class BaseDataService<T> {
  constructor(
    protected supabase: SupabaseService,
    @Inject(TABLE_NAME) protected tableName: string
  ) {}

  private handleError(error: PostgrestError): never {
    console.error('Database operation failed:', error);
    throw error;
  }

  getAll(query: any = {}): Observable<T[]> {
    return from(this.supabase.select(this.tableName, query)).pipe(
      map(response => {
        if (response.error) {
          this.handleError(response.error);
        }
        return (response.data || []) as T[];
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        throw error;
      })
    );
  }

  getById(id: string): Observable<T> {
    return from(this.supabase.select(this.tableName, { match: { id } })).pipe(
      map(response => {
        if (response.error) {
          this.handleError(response.error);
        }
        const items = (response.data || []) as T[];
        if (items.length === 0) {
          throw new Error('Record not found');
        }
        return items[0];
      }),
      catchError(error => {
        console.error('Error fetching record:', error);
        throw error;
      })
    );
  }

  create(data: Partial<T>): Observable<T> {
    return from(this.supabase.insert(this.tableName, data)).pipe(
      map(response => {
        if (response.error) {
          this.handleError(response.error);
        }
        const items = (response.data || []) as T[];
        if (items.length === 0) {
          throw new Error('Failed to create record');
        }
        return items[0];
      }),
      catchError(error => {
        console.error('Error creating record:', error);
        throw error;
      })
    );
  }

  update(id: string, data: Partial<T>): Observable<T> {
    return from(this.supabase.update(this.tableName, data, { id })).pipe(
      map(response => {
        if (response.error) {
          this.handleError(response.error);
        }
        const items = (response.data || []) as T[];
        if (items.length === 0) {
          throw new Error('Failed to update record');
        }
        return items[0];
      }),
      catchError(error => {
        console.error('Error updating record:', error);
        throw error;
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(this.supabase.delete(this.tableName, { id })).pipe(
      map(response => {
        if (response.error) {
          this.handleError(response.error);
        }
        return undefined;
      }),
      catchError(error => {
        console.error('Error deleting record:', error);
        throw error;
      })
    );
  }
}
