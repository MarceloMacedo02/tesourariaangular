import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PasswordRecoveryRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.component.html',
  styleUrls: ['./pass-reset.component.scss']
})
export class PassResetComponent {
  loading = false;
  message: string | null = null;
  error: string | null = null;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Form submit for password reset
   */
  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission

    this.loading = true;
    this.error = null;
    this.message = null;

    // Get form value
    const email = (document.getElementById('useremail') as HTMLInputElement)?.value;

    if (!email) {
      this.error = 'Please enter your email address';
      this.loading = false;
      return;
    }

    // Create password recovery request
    const recoveryRequest: PasswordRecoveryRequest = {
      email: email
    };

    // Call password recovery using our authentication service
    this.authService.recoverPassword(recoveryRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = response.message || 'Password recovery instructions sent to your email.';
        console.log('Password recovery successful', response);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Password recovery failed. Please try again.';
        console.error('Password recovery error:', err);
      }
    });
  }
}
