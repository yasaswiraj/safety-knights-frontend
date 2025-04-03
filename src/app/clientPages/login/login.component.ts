import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Import API Service
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false; // Add loading state

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
      this.isLoading = true; // Set loading state to true
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
          this.isLoading = false; // Reset loading state
        },
        error: (error) => {
          console.error('Login Failed:', error);
          this.errorMessage = error.error?.detail || 'Invalid credentials. Please try again.';
          this.isLoading = false; // Reset loading state
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
