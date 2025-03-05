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

@Component({
  selector: 'app-client-form3',
  templateUrl: './client-form3.component.html',
  styleUrls: ['./client-form3.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Ensures custom styles apply correctly
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, // ✅ Required for formGroup
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ClientForm3Component {
  clientForm: FormGroup;
  services = ['Audit', 'Inspection', 'Compliance Assessment', 'Training'];
  uploadedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientForm = this.fb.group({
      scopeOfService: [[], Validators.required], 
      jobDescription: ['', Validators.required],
      location: ['', Validators.required],
      deadline: ['', Validators.required] // ✅ Ensures deadline exists in FormGroup
    });
  }

  // ✅ Navigate to Next Form
  navigateToNextForm() {
    if (this.clientForm.valid) {
      this.router.navigate(['/client-form-4']);
    }
  }

  // ✅ Navigate back to Landing Page
  navigateToLandingPage() {
    this.router.navigate(['/']);
  }

  // ✅ Handle File Upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }
}
