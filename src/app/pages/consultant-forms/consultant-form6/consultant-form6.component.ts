

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-consultant-form6',
  templateUrl: './consultant-form6.component.html',
  styleUrls: ['./consultant-form6.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Ensures custom styles apply correctly
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, // 
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ]
})
export class ConsultantForm6Component{
  signUpForm1: FormGroup;
  services = ['Industrial Hygiene Assesments', 'Ventilation Assessments / Controls', 'Indoor Air Quality', 'Noise Assessments / Controls'];
  uploadedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signUpForm1 = this.fb.group({
      scopeOfService: [[], Validators.required], 
      jobDescription: ['', Validators.required],
      location: ['', Validators.required],
      deadline: ['', Validators.required] // 
    });
  }

  //  Navigate to Next Form
  navigateToNextForm() {
    this.router.navigate(['/consultant-form7']);
    if (this.signUpForm1.valid) {
      console.log("Form valid");
    }
  }

    // ✅ Navigate to Previous Form
    navigateToPreviousForm() {
      this.router.navigate(['/consultant-form5']);
    }

  // Navigate back to Landing Page
  navigateToLandingPage() {
    this.router.navigate(['/']);
  }

  //  Handle File Upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }
}
