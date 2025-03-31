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
import { ViewEncapsulation, OnInit } from '@angular/core';
import { FormDataService } from '../../../services/form-data.service';
import { ClientJobsService } from '../../../services/client-jobs.service';

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
export class ClientForm5Component implements OnInit {
  clientForm: FormGroup;
  showOtherPaymentTerm = false;
  showOtherPaymentMethod = false;

  totalSteps = 3; 
  currentStep = 3; 

  form4Values: any = {}; 

  paymentOptions = [
    { label: '30 Days', value: '30_days' },
    { label: '45 Days', value: '45_days' },
    { label: '60 Days', value: '60_days' }
  ];

  paymentMethods = [
    { label: 'ACH (Automated Clearing House)', value: 'ach' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Check', value: 'check' },
    { label: 'Purchase Order', value: 'purchase_order' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private formDataService: FormDataService, private clientJobsService: ClientJobsService) {
    this.clientForm = this.fb.group({
      paymentTerms: ['', Validators.required],
      otherPaymentTerm: [''], // Optional for custom input
      paymentMethod: ['', Validators.required],
      otherPaymentMethod: [''] // Optional for custom input
    });
  }



  ngOnInit() {
    this.form4Values = this.formDataService.getFormData();
    // You can prefill form or use values as needed
  }


  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  toggleOtherPaymentTerm() {
    this.showOtherPaymentTerm = !this.showOtherPaymentTerm;
  }

  toggleOtherPaymentMethod() {
    this.showOtherPaymentMethod = !this.showOtherPaymentMethod;
  }

  navigateToPreviousForm() {
    this.router.navigate(['/client/form-4']);
  }

  submitForm() {
    if (this.clientForm.valid) {
      const form5Data = this.clientForm.value;
      const form3and4 = this.form4Values;
  
      const combinedPayload = {
        scope_of_service: form3and4.scopeOfService.join(', '),
        work_in_detail: form3and4.jobDescription,
        project_location: form3and4.location,
        proposal_deadline: form3and4.deadline,
        expected_start_date: form3and4.projectStartDate,
        budget: parseInt(form3and4.budget, 10),  
        insurance_requirements: (form3and4.selectedInsurances as { label: string }[]).map((i) => i.label).join(', '),
        payment_terms: form5Data.paymentTerms,
        payment_method: form5Data.paymentMethod,
        contractor_preferences: '',
        commitment_to_proceed: ''
      };
  
      this.clientJobsService.createJob(combinedPayload).subscribe({
        next: (response) => {
          console.log('Job created:', response);
          this.router.navigate(['/client/pending-bids']);
        },
        error: (err) => {
          console.error('Job creation failed:', err);
        }
      });
    }
  }
}

