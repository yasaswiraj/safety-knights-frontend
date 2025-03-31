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
import { ViewEncapsulation, OnInit } from '@angular/core';
import { FormDataService } from '../../../services/form-data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-client-form4',
  templateUrl: './client-form4.component.html',
  styleUrls: ['./client-form4.component.css'],
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class ClientForm4Component implements OnInit {
  clientForm: FormGroup;

  totalSteps = 3; // ✅ Total forms
  currentStep = 2; // ✅ This is the second step

  form3Data: any = {}; // ✅ Store data from previous form


  // List of insurance options
  insuranceOptions = [
    { label: 'General Liability', controlName: 'generalLiability', coverageControlName: 'generalCoverage' },
    { label: 'Professional Liability', controlName: 'professionalLiability', coverageControlName: 'professionalCoverage' },
    { label: 'Workers’ Compensation', controlName: 'workersComp', coverageControlName: 'workersCompCoverage' },
    { label: 'Other', controlName: 'otherInsurance', coverageControlName: 'otherCoverage' }
  ];

  selectedInsuranceTypes: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private formDataService: FormDataService) {
    this.clientForm = this.fb.group({
      projectStartDate: ['', Validators.required],
      budget: ['', Validators.required],
      selectedInsurances: [[]], // Store selected insurances
      generalCoverage: [''],
      professionalCoverage: [''],
      workersCompCoverage: [''],
      otherCoverage: [''],
    });
  }

  ngOnInit() {
    const data = this.formDataService.getFormData();
    this.form3Data = data;
  
    if (data) {
      const formattedStartDate = this.formatDateToYYYYMMDD(data.projectStartDate);
  
      this.clientForm.patchValue({
        projectStartDate: formattedStartDate || '',  // 👈 formatted to yyyy-MM-dd
        budget: data.budget || '',
        selectedInsurances: data.selectedInsurances || []
      });
  
      this.selectedInsuranceTypes = data.selectedInsurances || [];
  
      this.selectedInsuranceTypes.forEach((insurance: any) => {
        const controlName = insurance.coverageControlName;
        if (!this.clientForm.contains(controlName)) {
          this.clientForm.addControl(controlName, this.fb.control('', Validators.required));
        }
        if (data[controlName]) {
          this.clientForm.patchValue({ [controlName]: data[controlName] });
        }
      });
  
      setTimeout(() => this.clientForm.updateValueAndValidity(), 0);
    }
  }
  
  

  minDate = new Date();

  onStartDateChange() {
    const start = new Date(this.clientForm.value.projectStartDate);
    const formData = this.formDataService.getFormData();
    if (formData?.deadline) {
      const deadline = new Date(formData.deadline);
      if (deadline < start) {
        alert('Project Start Date cannot be after Proposal Deadline. Please adjust accordingly.');
      }
    }
  }


  formatDateToYYYYMMDD(dateInput: string | Date): string | null {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return null;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error('Invalid date format:', dateInput);
      return null;
    }
  }




  // ✅ Updates the list of selected insurance types
  onInsuranceChange() {
    this.selectedInsuranceTypes = this.clientForm.value.selectedInsurances || [];

    this.selectedInsuranceTypes.forEach(insurance => {
      const controlName = insurance.coverageControlName;
      if (!this.clientForm.contains(controlName)) {
        this.clientForm.addControl(controlName, this.fb.control('', Validators.required));
      }
    });
  }


  // ✅ Calculate the Progress Percentage
  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  // ✅ Navigate to Previous Form
  navigateToPreviousForm() {
    this.router.navigate(['/client/form-3']);
  }

  navigateToNextForm() {
    console.log('VALID?', this.clientForm.valid);
    console.log('VALUE:', this.clientForm.value);
    console.log('ERRORS:', this.clientForm.errors);
    console.log('Controls:', this.clientForm.controls);

    if (this.clientForm.valid) {
      const form4Data = this.clientForm.value;

      const combinedData = {
        ...this.formDataService.getFormData(),
        ...form4Data
      };

      this.formDataService.setFormData(combinedData);
      this.router.navigate(['/client/form-5']);
    } else {
      alert('Form is invalid!');
    }
  }




}

