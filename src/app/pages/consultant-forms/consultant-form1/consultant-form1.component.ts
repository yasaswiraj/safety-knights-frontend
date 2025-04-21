import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-consultant-form1',
  templateUrl: './consultant-form1.component.html',
  styleUrls: ['./consultant-form1.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule, // ✅ Required for <mat-form-field>
    MatInputModule, // ✅ Required for <input matInput>
    MatIconModule,
 // ✅ Required for <mat-error>
]
})
export class ConsultantForm1Component {
  clientForm: FormGroup;
  formSubmitted = false;


  constructor(private fb: FormBuilder, private router: Router, private formDataService: FormDataService) {
    this.clientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator 
    }); 
  }

    // ✅ Custom Validator to Check if Password & Confirm Password Match
    passwordMatchValidator(form: FormGroup) {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    }

  navigateToNextForm() {
    this.formSubmitted = true;
  this.clientForm.markAllAsTouched(); // Trigger validation
  // this.router.navigate(['/consultant-form-contact']);
    if (this.clientForm.valid) {
      this.formDataService.setFormData(this.clientForm.value);
       this.router.navigate(['/consultant-form-contact']);
    }
  }

  navigateToLanding() {
    this.router.navigate(['/']);
  }

  
  onSubmit() {
    if (this.clientForm.valid) {
      alert('Form submitted successfully!');
    } else {
      alert('Please enter a valid email.');
    }
  }
}
