import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // ✅ Import API Service
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],  // ✅ Correct field name
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    
  }

  // ✅ Handle Login API Request and Store Token
  onLogin() {
    console.log('Login clicked');
    if (this.loginForm.valid) {
      this.apiService.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('✅ Login Successful:', response);
  
          // ✅ Store Access Token in Local Storage
          localStorage.setItem('access_token', response.access_token);
  
          // ✅ Redirect to Dashboard
          this.router.navigate(['/client/bids-in-progress']);
        },
        error: (error) => {
          console.error('❌ Login Failed:', error);
          this.errorMessage = error.error?.detail || 'Invalid credentials. Please try again.';
        }
      });
    }
  }
  
  

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  navigateToForgotPassword() {
    console.log('Forgot password clicked');
  }
}
