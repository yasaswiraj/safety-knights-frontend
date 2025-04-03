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
import { FormDataService } from '../../../services/form-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-consultant3-form',
  templateUrl: './consultant-form3.component.html',
  styleUrls: ['./consultant-form3.component.css'],
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
export class ConsultantForm3Component implements OnInit {
  signUpForm!: FormGroup;  
  selectedPrimaryServices: Record<string, string[]> = {};  
  dependentServices: Record<string, string[]> = {};  
  categories: Record<string, Record<string, { type: string; option?: string[] }>> = {};  // Corrected to directly store category data

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formDataService: FormDataService,
    private http: HttpClient
  ) {
    this.signUpForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      confirm_password: [''],
      job_title: [''],
      company_name: [''],
      company_address: [''],
      phone_number: [''],
      scopeOfService: [[]],  
      dependentService: [[]], 
      jobDescription: [''],
      categories: this.fb.group({})  
    });
  }

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get(`${environment.apiUrl}/consultant/get-form`).subscribe((response: any) => {
      const filteredCategories = { ...response.categories };
    delete filteredCategories["Availability & Additional Comments"];

    this.categories = filteredCategories;
    this.initializeForm();
    });
  }

  initializeForm() {
    const categoryGroup = this.signUpForm.get('categories') as FormGroup;
    if (!categoryGroup) {
      console.error('Category group is undefined');
      return;
    }

    Object.keys(this.categories).forEach(category => {  // ✅ Fixed reference
      const subcategories = this.categories[category];

      categoryGroup.addControl(category, this.fb.group({}));

      Object.keys(subcategories).forEach(subcategory => {
        const subcategoryControl = categoryGroup.get(category) as FormGroup;

        if (subcategoryControl) {
          const subcategoryData = subcategories[subcategory];
          
          if (subcategoryData.type === 'checkbox') {
            subcategoryControl.addControl(subcategory, this.fb.array([]));
          } else {
            subcategoryControl.addControl(subcategory, this.fb.control(''));
          }
        }
      });
    });
  }

  onPrimaryServiceChange(category: string, subcategory: string, selectedServices: string[]) {
    this.selectedPrimaryServices[subcategory] = selectedServices;

    const categoryData = this.categories[category];  // ✅ Fixed reference
    const availableOptions = categoryData[subcategory]?.option || [];

    this.dependentServices[subcategory] = availableOptions.filter((option: string) =>
      selectedServices.includes(option)
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  }

  navigateToNextForm() {
    this.formDataService.setFormDataWithTransform(3, this.signUpForm.value);
      this.router.navigate(['/consultant-form8']);
    
  }

  navigateToPreviousForm() {
    this.router.navigate(['/consultant-form1']);
  }
}
