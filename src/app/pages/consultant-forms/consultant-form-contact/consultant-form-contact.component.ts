import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { FormDataService } from '../../../services/form-data.service'; // Corrected import path

@Component({
  selector: 'app-client-form2',
  templateUrl: './consultant-form-contact.component.html',
  styleUrls: ['./consultant-form-contact.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,  // ✅ Required for <mat-form-field>
    MatInputModule,      // ✅ Required for <input matInput>
    MatIconModule
  ]
})
export class ConsultantFormContactComponent {
  clientForm: FormGroup;
  formSubmitted = false;


  constructor(private fb: FormBuilder, private router: Router,private formDataService: FormDataService, ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]]
    });
  }

  // ✅ Navigate to Client-Form1
  navigateToPreviousForm() {
    this.router.navigate(['/consultant-form1']);
  }

  // ✅ Navigate to Landing Page
  navigateToLanding() {
    this.router.navigate(['/']);
  }

  //  Navigate to Next Form
  navigateToNextForm() {
    // this.formSubmitted = true;
    // this.clientForm.markAllAsTouched(); 
    // this.router.navigate(['/consultant-form3']);
    console.log("Button Clicked!");
    if (this.clientForm.valid) {
      console.log('Form is valid, navigating to consultant-form3');
      this.formDataService.setFormData(this.clientForm.value);
      this.router.navigate(['/consultant-form3']);
    }else {
      console.log('Form is invalid, check fields:', this.clientForm.value);
      // alert('Please fill in all required fields.');
    }
  }

  // ✅ Navigate to Client-Dashboard
  navigateToDashboard() {
    if (this.clientForm.valid) {
      console.log('Form Submitted:', this.clientForm.value);
      this.router.navigate(['/client/dashboard']);
    } else {
      alert('Please fill in all required fields.');
    }
  }
  
}
