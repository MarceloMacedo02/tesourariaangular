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

    // Call the password recovery method
    this.authService.sendPasswordRecoveryEmail(email)
      .subscribe({
        next: (success: boolean) => {
          this.loading = false;
          if (success) {
            this.message = 'Password reset instructions have been sent to your email address.';
          } else {
            this.error = 'An error occurred while sending the recovery email. Please try again.';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Password recovery error:', err);
          this.error = 'An error occurred while sending the recovery email. Please try again.';
        }
      });
  }
}
