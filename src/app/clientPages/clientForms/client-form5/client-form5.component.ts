import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-client-form5',
  templateUrl: './client-form5.component.html',
  styleUrls: ['./client-form5.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Ensures custom styles apply correctly
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule
  ]
})
export class ClientForm5Component {
  clientForm: FormGroup;
  showOtherPaymentTerm = false;
  showOtherPaymentMethod = false;

  totalSteps = 3; // ✅ Total steps in form sequence
  currentStep = 3; // ✅ This is the last step

  // ✅ List of Payment Options
  paymentOptions = [
    { label: '30 Days', value: '30_days' },
    { label: '45 Days', value: '45_days' },
    { label: '60 Days', value: '60_days' }
  ];

  // ✅ List of Payment Methods
  paymentMethods = [
    { label: 'ACH (Automated Clearing House)', value: 'ach' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Check', value: 'check' },
    { label: 'Purchase Order', value: 'purchase_order' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientForm = this.fb.group({
      paymentTerms: ['', Validators.required],
      otherPaymentTerm: [''], // Optional for custom input
      paymentMethod: ['', Validators.required],
      otherPaymentMethod: [''] // Optional for custom input
    });
  }

  // ✅ Compute progress dynamically
  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // ✅ Show/Hide Custom Payment Term Input
  toggleOtherPaymentTerm() {
    this.showOtherPaymentTerm = !this.showOtherPaymentTerm;
  }

  // ✅ Show/Hide Custom Payment Method Input
  toggleOtherPaymentMethod() {
    this.showOtherPaymentMethod = !this.showOtherPaymentMethod;
  }

  // ✅ Navigate to Previous Form
  navigateToPreviousForm() {
    this.router.navigate(['/client/form-4']);
  }

  // ✅ Submit Form & Navigate to Dashboard
  submitForm() {
    if (this.clientForm.valid) {
      console.log('Job Created:', this.clientForm.value);
      this.router.navigate(['/client/pending-bids']);
    }
  }
}

