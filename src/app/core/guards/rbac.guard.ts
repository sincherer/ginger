import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { RbacService } from '../services/rbac.service';

@Injectable({
  providedIn: 'root'
})
export class RbacGuard implements CanActivate {
  constructor(
    private rbacService: RbacService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredModule = route.data['module'] as string;
    const requiredAction = route.data['action'] as string;

    if (!requiredModule || !requiredAction) {
      console.warn('RBAC Guard: Module or action not specified in route data');
      return of(true);
    }

    // First check if user is admin, if so, grant access to everything
    return this.rbacService.isAdmin().pipe(
      switchMap(isAdmin => {
        // If user is admin, allow access without checking specific permissions
        if (isAdmin) {
          return of(true);
        }
        
        // Otherwise, check specific permissions
        return this.rbacService.hasPermission(requiredModule, requiredAction);
      }),
      tap(hasPermission => {
        if (!hasPermission) {
          console.warn(`Access denied: User lacks permission for ${requiredModule}:${requiredAction}`);
          this.router.navigate(['/unauthorized']);
        }
      })
    );
  }
}