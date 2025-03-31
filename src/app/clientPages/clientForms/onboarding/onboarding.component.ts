import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientOnboardingService } from '../../../services/client-onboarding.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ]
})
export class OnboardingComponent {
  clientForm: FormGroup;
  errorMessage = '';
  currentStep = 0;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private onboardingService: ClientOnboardingService
  ) {
    this.clientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]],
      job_title: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      company_address: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
    });
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 0) {
      const emailValid = this.clientForm.get('email')?.valid ?? false;
      const nameValid = this.clientForm.get('name')?.valid ?? false;
      const passwordValid = this.clientForm.get('password')?.valid ?? false;
      const confirmPasswordValid = this.clientForm.get('confirm_password')?.valid ?? false;
      return emailValid && nameValid && passwordValid && confirmPasswordValid;
    }
    return true;
  }

  submitForm() {
    if (this.clientForm.valid) {
        const formData = {
            name: this.clientForm.value.name,
            email: this.clientForm.value.email,
            password: this.clientForm.value.password,
            confirm_password: this.clientForm.value.confirm_password, 
            job_title: this.clientForm.value.job_title,
            company_name: this.clientForm.value.company_name,
            company_address: this.clientForm.value.company_address,
            phone_number: this.clientForm.value.phone_number,
            user_type: 'CLIENT',
            user_status: 'active'
        };

        // ✅ Check if confirm_password is missing
        if (!formData.confirm_password) {
            this.errorMessage = "Confirm password is required!";
            return;
        }

        // ✅ Ensure passwords match before sending the request
        if (formData.password !== formData.confirm_password) {
            this.errorMessage = "Passwords do not match!";
            return;
        }

        // ✅ Debugging Log
        console.log("🚀 Sending Data:", formData);

        this.onboardingService.submitForm(formData).subscribe({
            next: (response) => {
                console.log("✅ Signup Successful:", response);
                this.router.navigate(['/login']);
            },
            error: (error) => {
                console.error("❌ Signup Failed:", error);
                this.errorMessage = error.error?.detail || "Signup failed! Please try again.";
            }
        });
    } else {
        this.errorMessage = "Please fill in all required fields.";
    }
}


  nextStep() {
    if (this.validateCurrentStep()) {
      this.currentStep = 1;
    }
  }

  previousStep() {
    this.currentStep = 0;
  }
}
