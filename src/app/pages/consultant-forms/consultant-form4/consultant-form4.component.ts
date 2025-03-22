import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { FormDataService } from '../../../services/form-data-service'; // Import the FormDataService

@Component({
  selector: 'app-consultant-form4',
  templateUrl: './consultant-form4.component.html',
  styleUrls: ['./consultant-form4.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
    NavBarComponent
  ]
})
export class ConsultantForm4Component implements OnInit {
  signUpForm1: FormGroup;
  services = ['Soil and Groundwater Sampling', 'Contamination Delineation', 'Waste Profiling', 'Beneficial Reuse Determination'];
  dependentServices: string[] = [];
  uploadedFile: File | null = null;

  private dependentOptionsMap: Record<string, string[]> = {
    'Soil and Groundwater Sampling': ['Phase I ESA', 'Groundwater Monitoring', 'Vapor Intrusion Assessment'],
    'Contamination Delineation': ['Site Characterization', 'Risk-Based Closure', 'Remedial Design'],
    'Waste Profiling': ['Hazardous Waste Classification', 'DOT Classification', 'Waste Minimization'],
    'Beneficial Reuse Determination': ['Material Testing', 'Regulatory Compliance', 'Sustainability Assessment']
  };
  totalSteps = 2; // Total forms in the process
  currentStep = 2; // Update this for each form


  constructor(private fb: FormBuilder, private router: Router, private formDataService: FormDataService) {
  this.signUpForm1 = this.fb.group({
    scopeOfService: [{ value: [], disabled: false }, Validators.required],
    dependentService: [{ value: '', disabled: false }, Validators.required],
    jobDescription: [{ value: '', disabled: false }, Validators.required],
    location: [{ value: '', disabled: false }, Validators.required],
    deadline: [{ value: '', disabled: false }, Validators.required],
    serviceDetails: this.fb.array([])
  }); }
  
  // ✅ Calculate the Progress Percentage
  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  ngOnInit() {
    this.setupDependentDropdown();
  }

  get serviceDetails(): FormArray {
    return this.signUpForm1.get('serviceDetails') as FormArray;
  }

  private setupDependentDropdown() {
    this.signUpForm1.get('scopeOfService')?.valueChanges.subscribe((selected: string[]) => {
      this.dependentServices = [
        ...new Set(selected.flatMap(service => 
          this.dependentOptionsMap[service] || []
        ))
      ];
      this.signUpForm1.get('dependentService')?.reset();
    });
  }

  navigateToNextForm() {
    this.formDataService.setFormData(4, this.signUpForm1.value);
      this.router.navigate(['/consultant-form8']);
    
  }

  navigateToPreviousForm() {
    this.router.navigate(['/consultant-form3']);
  }

  getServiceControl(index: number): FormControl {
    return this.serviceDetails.at(index) as FormControl;
  }

  submitForm() {
    console.log(this.signUpForm1.value);
  }

  navigateToLandingPage() {
    this.router.navigate(['/']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  
  }

  addServiceDetail() {
    this.serviceDetails.push(this.fb.control(''));
  }
}