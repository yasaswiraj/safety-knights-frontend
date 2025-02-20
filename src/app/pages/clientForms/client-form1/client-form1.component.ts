import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-form1',
  templateUrl: './client-form1.component.html',
  styleUrls: ['./client-form1.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
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
      console.log('Navigating to Client-Form2');
      this.router.navigate(['/client-form-2']);
    }
  }

  navigateToLanding() {
    this.router.navigate(['/']);
  }
  
  onSubmit() {
    if (this.clientForm.valid) {
      console.log('Form Submitted:', this.clientForm.value);
      alert('Form submitted successfully!');
    } else {
      alert('Please enter a valid email.');
    }
  }

  
}

  

