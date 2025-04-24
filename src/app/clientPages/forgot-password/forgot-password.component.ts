import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [FormsModule, CommonModule], // Add FormsModule to imports
})
export class ForgotPasswordComponent {

  step = 1; // 1: enter email, 2: verify OTP, 3: reset password
  email = '';
  otp = '';
  newPassword = '';
  message = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  sendEmail() {
    this.auth.sendForgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.step = 2;
      },
      error: () => {
        this.error = 'Something went wrong. Please try again.';
      },
    });
  }

  verifyOtp() {
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.step = 3;
      },
      error: () => {
        this.error = 'Invalid or expired OTP.';
      },
    });
  }

  resetPassword() {
    this.auth.resetPassword(this.email, this.otp, this.newPassword).subscribe({
      next: (res: any) => {
        this.message = res.message;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.error = 'Failed to reset password.';
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);    }
}
