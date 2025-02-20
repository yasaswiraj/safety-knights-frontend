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

@Component({
  selector: 'app-consultant-form1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './consultant-form1.component.html',
  styleUrls: ['./consultant-form1.component.css'],
})
export class ConsultantForm1Component {
  clientForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.clientForm.valid) {
      const { email, password, confirmPassword } = this.clientForm.value;

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      console.log('Form Submitted:', this.clientForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
