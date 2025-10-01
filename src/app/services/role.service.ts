import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  constructor(private authService: AuthService) { }

  /**
   * Get user roles
   */
  getUserRoles(): Observable<Role[]> {
    // Get current user from auth service
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !currentUser.role) {
      return of([]);
    }

    // In a real application, you would typically make an API call to get user roles
    // For now, we'll return a mock based on the user's role
    const roles: Role[] = this.getMockRoles(currentUser.role);
    return of(roles);
  }

  /**
   * Check if user has a specific role
   */
  hasRole(roleName: string): Observable<boolean> {
    return new Observable(observer => {
      this.getUserRoles().subscribe(roles => {
        const hasRole = roles.some(role => role.name === roleName);
        observer.next(hasRole);
        observer.complete();
      });
    });
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roleNames: string[]): Observable<boolean> {
    return new Observable(observer => {
      this.getUserRoles().subscribe(roles => {
        const hasAnyRole = roles.some(role => roleNames.includes(role.name));
        observer.next(hasAnyRole);
        observer.complete();
      });
    });
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roleNames: string[]): Observable<boolean> {
    return new Observable(observer => {
      this.getUserRoles().subscribe(roles => {
        const userRoleNames = roles.map(role => role.name);
        const hasAllRoles = roleNames.every(roleName => userRoleNames.includes(roleName));
        observer.next(hasAllRoles);
        observer.complete();
      });
    });
  }

  /**
   * Get mock roles based on user's role
   */
  private getMockRoles(userRole: string): Role[] {
    // This is a simplified mock - in a real app, roles would come from an API
    const allRoles: Role[] = [
      {
        id: 1,
        name: 'admin',
        description: 'Administrator role with full access',
        permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles']
      },
      {
        id: 2,
        name: 'user',
        description: 'Standard user role with basic access',
        permissions: ['read', 'write']
      },
      {
        id: 3,
        name: 'viewer',
        description: 'Viewer role with read-only access',
        permissions: ['read']
      }
    ];

    // Return the role that matches the user's role
    // In a real application, a user might have multiple roles
    return allRoles.filter(role => role.name === userRole);
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): Observable<boolean> {
    return new Observable(observer => {
      this.getUserRoles().subscribe(roles => {
        const hasPermission = roles.some(role => 
          role.permissions.includes(permission)
        );
        observer.next(hasPermission);
        observer.complete();
      });
    });
  }

  /**
   * Check if user is tesoureiro
   */
  isTesoureiro(): boolean {
    // Assuming 'tesoureiro' might be a role name
    // In a real app, you'd check the user's roles properly
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role) {
      // This is a simple check - in a real app, you might need to fetch roles and check
      // based on your specific authorization logic
      return currentUser.role.toLowerCase().includes('tesoureiro');
    }
    return false;
  }
}