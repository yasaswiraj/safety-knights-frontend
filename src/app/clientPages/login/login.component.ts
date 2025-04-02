import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Import API Service
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
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],  // Correct field name
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    
  }

  // Handle Login API Request and Store Token
  onLogin() {
    console.log('Login clicked');
    if (this.loginForm.valid) {
      this.apiService.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login Successful:', response);
  
          // localStorage.setItem('access_token', response.access_token);
          // localStorage.setItem('user_id', response.user_id);
  
          // Redirect to Dashboard
          if(response.user_type === 'client')
          this.router.navigate(['/client/bids-in-progress']);
          else if(response.user_type === 'consultant')
          this.router.navigate(['/consultant/consultant-matches']);
          else 
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Login Failed:', error);
          this.errorMessage = error.error?.detail || 'Invalid credentials. Please try again.';
        }
      });
    }
  }
  
  

  navigateToSignUp() {
    this.router.navigate(['/onboarding']);
  }

  navigateToForgotPassword() {
    console.log('Forgot password clicked');
  }
}
