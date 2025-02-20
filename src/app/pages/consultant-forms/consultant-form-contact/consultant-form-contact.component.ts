import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'consultant-form-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './consultant-form-contact.component.html',
  styleUrls: ['./consultant-form-contact.component.css'],
})
export class ConsultantFormContactComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form with controls and validation
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Form Submitted', this.signupForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
