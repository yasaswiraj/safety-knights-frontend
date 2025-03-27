import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientOnboardingService } from '../../../services/client-onboarding.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-form2',
  templateUrl: './client-form2.component.html',
  styleUrls: ['./client-form2.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule, // ✅ Required for <mat-form-field>
    MatInputModule,     // ✅ Required for <input matInput>
    MatIconModule       // ✅ Required for icons
  ]
})
export class ClientForm2Component {
  clientForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private onboardingService: ClientOnboardingService
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],  // ✅ Ensure consistency with HTML
      companyName: ['', [Validators.required]],  // ✅ Ensure consistency with HTML
      companyAddress: ['', [Validators.required]],  // ✅ Ensure consistency with HTML
      phone_number: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    });

    // Load saved data if exists
    const savedData = this.onboardingService.getFormData();
    this.clientForm.patchValue(savedData);
  }

  navigateToPreviousForm() {
    console.log(" nav back Function called");
    this.router.navigate(['/client/form-1']);
  }

  submitForm() {
    console.log("Function called");
    if (this.clientForm.valid) {
      // Ensure passwords match
      const formData = {
        name: this.clientForm.value.name,
        email: this.onboardingService.getFormData().email || '', // ✅ Retrieve email if stored in Form1
        password: this.clientForm.value.password,
        confirm_password: this.clientForm.value.confirm_password,
        job_title: this.clientForm.value.jobTitle, // ✅ Match backend key
        company_name: this.clientForm.value.companyName, // ✅ Match backend key
        company_address: this.clientForm.value.companyAddress, // ✅ Match backend key
        phone_number: this.clientForm.value.phone_number
      };
  
      if (!formData.email) {
        this.errorMessage = "Email is missing! Please complete the previous form.";
        console.error("❌ Email is missing from form submission");
        return;
      }
  
      if (formData.password !== formData.confirm_password) {
        this.errorMessage = "Passwords do not match!";
        console.error("❌ Passwords do not match");
        return;
      }
  
      // ✅ Remove confirm_password before submission
      delete formData.confirm_password;
  
      console.log("📤 Sending data to backend:", formData); // ✅ Debugging Log
  
      // ✅ Pass formData explicitly to the service
      this.onboardingService.submitForm(formData).subscribe(
        response => {
          console.log("✅ Signup Successful:", response);
          this.router.navigate(['/client/pending-bids']);
        },
        error => {
          console.error("❌ Signup Failed:", error);
          this.errorMessage = error.error?.detail || "Signup failed! Please try again.";
        }
      );
    } else {
      this.errorMessage = "Please fill in all required fields.";
      console.error("❌ Form validation failed:", this.clientForm.value);
    }
  }
  
}
