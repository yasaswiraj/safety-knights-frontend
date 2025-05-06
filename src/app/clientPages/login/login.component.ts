import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Import API Service
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../components/loading/loading.component";
import { ChatService } from '../../services/chat.service';

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

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService, private chatService: ChatService) {
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
  
          // Set loggedIn flag and userType in localStorage
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('userType', response.user_type);
          localStorage.setItem('userStatus', response.user_status);
  
          // Store access_token in localStorage instead of sessionStorage
          if(response.access_token) {
            localStorage.setItem('access_token', response.access_token);
          }

          // Redirect to Dashboard based on userType
          if (response.user_type === 'client')
            this.router.navigate(['/client/bids-in-progress']);
          else if (response.user_type === 'consultant')
            if(response.user_status === 'approved') this.router.navigate(['/consultant']);
            else this.router.navigate(['/consultant/consultant-inbox']);
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
    this.router.navigate(['/']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
