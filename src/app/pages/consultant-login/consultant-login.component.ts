import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Import API Service
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultant-login',
  templateUrl: './consultant-login.component.html',
  styleUrls: ['./consultant-login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ConsultantLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

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
          this.router.navigate(['/consultant']);
        },
        error: (error) => {
          console.error('Login Failed:', error);
          this.errorMessage = error.error?.detail || 'Invalid credentials. Please try again.';
        }
      });
    }
  }
  
  

  navigateToSignUp() {
    this.router.navigate(['/consultant-form1']);
  }

  navigateToForgotPassword() {
    console.log('Forgot password clicked');
  }
}
