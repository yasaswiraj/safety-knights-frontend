import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-form2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form2.component.html',
  styleUrl: './client-form2.component.css',
})
export class ClientForm2Component {
  clientForm = new FormGroup({
    name: new FormControl('', Validators.required),
    jobTitle: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    companyAddress: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.clientForm.valid) {
      console.log('Form Submitted:', this.clientForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
