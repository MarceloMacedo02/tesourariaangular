import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth.service';

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

    // Create login request
    const loginRequest: LoginRequest = {
      username: username,
      password: password
    };

    // Login using our authentication service
    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login successful', response);
        // Navigate to the dashboard page after successful login
        this.router.navigate(['/pages']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      }
    });
  }
}
