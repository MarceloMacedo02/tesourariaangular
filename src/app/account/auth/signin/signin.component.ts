import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse, LoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  loading = false;
  error: string | null = null;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // redirect to dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/pages']);
    }
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/pages']);
      return;
    }
  }

  /**
   * Form submit for login
   */
  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission

    this.loading = true;
    this.error = null;

    // Get form values
    const username = (document.getElementById('username') as HTMLInputElement)?.value;
    const password = (document.getElementById('password-input') as HTMLInputElement)?.value;

    if (!username || !password) {
      this.error = 'Please enter both username and password';
      this.loading = false;
      return;
    }

    // Attempt login
    this.authService.login(username, password)
      .subscribe({
        next: (response: LoginResponse) => {
          this.loading = false;
          if (response && response.token) {
            // Navigate to dashboard or home page after successful login
            this.router.navigate(['/pages']);
          } else {
            this.error = 'Login failed: Invalid response from server';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login error:', err);
          if (err.status === 401) {
            this.error = 'Invalid username or password';
          } else if (err.status === 403) {
            this.error = 'Access denied';
          } else {
            this.error = 'An error occurred during login. Please try again.';
          }
        }
      });
  }
}