import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ✅ Import ReactiveFormsModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule] // ✅ Fix: Add ReactiveFormsModule
})
export class SignUpComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      console.log('Sign-Up Successful', this.signupForm.value);
      this.router.navigate(['/consultant-form1']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}