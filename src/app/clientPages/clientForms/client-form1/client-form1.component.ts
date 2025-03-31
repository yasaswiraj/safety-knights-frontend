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
    MatIconModule       // ✅ Required for icons
  ]
})
export class ClientForm1Component {
  clientForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    });
  }

  navigateToNextForm() {
    if (this.clientForm.valid) {
      if (this.clientForm.value.password !== this.clientForm.value.confirm_password) {
        alert("Passwords do not match!");  // ✅ Basic validation
        return;
      }
      this.router.navigate(['/client/form-2']);
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm_password') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
