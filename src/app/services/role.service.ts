import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private authService: AuthService) { }

  hasRole(role: string): boolean {
    const user = this.authService.getCurrentUser();
    return user && user.role === role;
  }

  isTesoureiro(): boolean {
    return this.hasRole('TESOUREIRO');
  }
}