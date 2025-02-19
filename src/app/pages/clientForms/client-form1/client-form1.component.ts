import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form1.component.html',
  styleUrl: './client-form1.component.css',
})
export class ClientForm1Component {
  clientForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.clientForm.valid) {
      console.log('Form Submitted:', this.clientForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please enter a valid email.');
    }
  }
}
