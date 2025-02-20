import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-form2',
  templateUrl: './client-form2.component.html',
  styleUrls: ['./client-form2.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
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
    this.router.navigate(['/client-form-1']);
  }

  // ✅ Navigate to Landing Page
  navigateToLanding() {
    this.router.navigate(['/']);
  }

  // ✅ Navigate to Client-Dashboard
  navigateToDashboard() {
    this.router.navigate(['/client-dashboard']);
  }

  onSubmit() {
    if (this.clientForm.valid) {
      console.log('Form Submitted:', this.clientForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill in all required fields.');
    }
  }
}