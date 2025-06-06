import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  username: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { username: 'admin', role: 'admin' },
    { username: 'user', role: 'user' }
  ];

  private loggedInUser: User | null = null;

  login(username: string, password: string): Observable<User> {
    // Simulate login delay
    return of(this.users).pipe(
      delay(500),
      map(users => {
        const user = users.find(u => u.username === username);
        if (user && password === 'password') {
          this.loggedInUser = user;
          return user;
        } else {
          throw new Error('Invalid username or password');
        }
      })
    );
  }

  logout() {
    this.loggedInUser = null;
  }

  getCurrentUser(): User | null {
    return this.loggedInUser;
  }

  isLoggedIn(): boolean {
    return this.loggedInUser !== null;
  }
}
