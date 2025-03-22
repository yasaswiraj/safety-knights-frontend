import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
    MatFormFieldModule,  // ✅ Required for <mat-form-field>
    MatInputModule,      // ✅ Required for <input matInput>
    MatIconModule       // ✅ Required for <mat-error>
  ]
})
export class ClientForm2Component {
  clientForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]]
    });
  }

  // ✅ Navigate to Client-Form1
  navigateToPreviousForm() {
    this.router.navigate(['/client/form-1']);
  }

  // ✅ Navigate to Landing Page
  navigateToLanding() {
    this.router.navigate(['/']);
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
