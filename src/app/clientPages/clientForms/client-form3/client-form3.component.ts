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
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-client-form3',
  templateUrl: './client-form3.component.html',
  styleUrls: ['./client-form3.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
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

  totalSteps = 3; // Total forms in the process
  currentStep = 1; // Update this for each form

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formDataService: FormDataService
  ) {
    this.clientForm = this.fb.group({
      scopeOfService: [[], Validators.required],
      jobDescription: ['', Validators.required],
      location: ['', Validators.required],
      deadline: ['', Validators.required],
      uploadedFile: [null]  // ✅ Add file field to the form
    });
  }


  // ✅ Calculate the Progress Percentage
  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // ✅ Navigate to Next Form
  navigateToNextForm() {
    if (this.clientForm.valid) {
      this.formDataService.setFormData(this.clientForm.value);
      this.router.navigate(['/client/form-4']);
    }
  }

  // ✅ Handle File Upload
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadedFile = file;
      this.clientForm.patchValue({ uploadedFile: file });
      this.formDataService.setUploadedFile(file); // 🔁 Optional but recommended for continuity
    }
  }

}
