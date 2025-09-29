import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  // set the current year
  year: number = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router) { }

  /**
 * Logout the user
 */
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }
}
