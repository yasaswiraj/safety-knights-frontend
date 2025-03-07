import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-client-form4',
  templateUrl: './client-form4.component.html',
  styleUrls: ['./client-form4.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Ensures custom styles apply correctly
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // ✅ Required for formGroup
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class ClientForm4Component {
  clientForm: FormGroup;
  
  totalSteps = 3; // ✅ Total forms
  currentStep = 2; // ✅ This is the second step

  // List of insurance options
  insuranceOptions = [
    { label: 'General Liability', controlName: 'generalLiability', coverageControlName: 'generalCoverage' },
    { label: 'Professional Liability', controlName: 'professionalLiability', coverageControlName: 'professionalCoverage' },
    { label: 'Workers’ Compensation', controlName: 'workersComp', coverageControlName: 'workersCompCoverage' },
    { label: 'Other', controlName: 'otherInsurance', coverageControlName: 'otherCoverage' }
  ];

  selectedInsuranceTypes: any[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientForm = this.fb.group({
      projectStartDate: ['', Validators.required],
      budget: ['', Validators.required],
      selectedInsurances: [[]], // Store selected insurances
      generalCoverage: [''],
      professionalCoverage: [''],
      workersCompCoverage: [''],
      otherCoverage: ['']
    });
  }

  // ✅ Updates the list of selected insurance types
  onInsuranceChange() {
    const selectedValues = this.clientForm.get('selectedInsurances')?.value || [];
    this.selectedInsuranceTypes = selectedValues;
  }

  // ✅ Calculate the Progress Percentage
  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // ✅ Navigate to Previous Form
  navigateToPreviousForm() {
    this.router.navigate(['/client/form-3']);
  }

  // ✅ Navigate to Next Form
  navigateToNextForm() {
    if (this.clientForm.valid) {
      this.router.navigate(['/client/form-5']);
    }
  }
}

