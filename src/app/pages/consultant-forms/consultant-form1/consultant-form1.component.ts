
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-form1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
    
  ],
  templateUrl: './consultant-form1.component.html',
  styleUrls: ['./consultant-form1.component.css'],
})
export class ConsultantForm1Component {
  consultantForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    // password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    // confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router) {}

  navigateToNextForm() {
    if (this.consultantForm.valid) {
      console.log('Navigating to Client-Form2');
      this.router.navigate(['/consultant-form-contact']);
    }
  }
  
  navigateToLanding() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.consultantForm.valid) {
      this.router.navigate(['/consultant-form-contact']);
      const { email} = this.consultantForm.value;

      // // Check if passwords match
      // if (password !== confirmPassword) {
      //   alert('Passwords do not match!');
      //   return;
      // }

      // console.log('Form Submitted:', this.consultantForm.value);
      // alert('Form submitted successfully!');

      // Navigate to the next form
      
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
