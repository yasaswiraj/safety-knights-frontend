import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-form1',
  templateUrl: './client-form1.component.html',
  styleUrls: ['./client-form1.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,  // ✅ Required for <mat-form-field>
    MatInputModule,      // ✅ Required for <input matInput>
    MatIconModule       // ✅ Required for <mat-error>
  ]
})
export class ClientForm1Component {
  clientForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  navigateToNextForm() {
    if (this.clientForm.valid) {
      this.router.navigate(['/client/form-2']);
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
