import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ✅ Import ReactiveFormsModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { // Inject Router
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Navigate to Client Dashboard on Successful Login
  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login Successful', this.loginForm.value);
      this.router.navigate(['/consultant']); // Redirect to client-dashboard
    }
  }

  // Navigate to Sign-Up Page
  navigateToSignUp() {
    this.router.navigate(['/consultant-form1']); // Redirect to sign-up
  }

  navigateToForgotPassword() {
    console.log('Forgot password clicked');
  } 
}