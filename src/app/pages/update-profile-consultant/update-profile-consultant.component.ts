import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientJobsService } from '../../services/client-jobs.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantMatchesService } from '../../services/consultant-match.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { FormDataService } from '../../services/form-data.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-consultant-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatSnackBarModule,  CommonModule,
    ReactiveFormsModule, MatFormFieldModule,
    MatSelectModule, MatIconModule,],
  templateUrl: './update-profile-consultant.component.html',
  styleUrls: ['./update-profile-consultant.component.css']
})
export class UpdateProfileConsultantComponent implements OnInit {
  updateForm!: FormGroup;
  profile: any = null;
  originalProfile: any = null;
  editMode = false;
  categories: Record<string, Record<string, { type: string; option?: string[] }>> = {};
  selectedFiles: File[] = [];
  categoryFiles: { [key: string]: File[] } = {};

  serviceCategories: string[] = [
    'environmental_services',
    'property_transactions',
    'field_activities',
    'hazardous_materials',
    'safety_facility_compliance',
    'industrial_hygiene',
    'construction_safety'
  ];

  total_jobs: number = 0; 
  completed_jobs: number = 0;
  active_jobs: number = 0;
  allQuestions: any= {};
  response: any;
  

  constructor(
    private consultantservice: ConsultantMatchesService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private router: Router,
        private formDataService: FormDataService,
        private http: HttpClient,
      
  ) {
    this.updateForm = this.fb.group({
      name: '',
      email: '',
      phone_number: '',
      job_title: '',
      company_name: '',
      company_address: '',
      jobDescription: '',
      categories: this.fb.group({
        environmental_services: this.fb.array([]),  // Use empty array as default
        property_transactions: [[]],
        field_activities: [[]],
        hazardous_materials: [[]],
        safety_facility_compliance: [[]],
        industrial_hygiene: [[]],
        construction_safety: [[]],
      }),
      written_responses: this.fb.group({
        'Please state any specifics about availability that you may have': [''],
        'Additional Information, Comments or Clarifications': ['']
      })
    });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.fetchTotalJobs(); 
    // Check route data for editMode flag
    const isEditRoute = this.route.snapshot.data['editMode'];
    if (isEditRoute) {
      this.editMode = true;
    }
  }

  loadProfile(): void {
    this.consultantservice.getProfile().subscribe({
      next: (data) => {
        this.allQuestions = data.form_structure.categories;
        console.log('Form structure categories:', this.allQuestions);
        this.profile = data.response;
        console.log('Profile data:', this.profile);
        this.originalProfile = JSON.parse(JSON.stringify(data.response));
        const filteredCategories = data.form_structure.categories;
      delete filteredCategories["Availability & Additional Comments"];
        this.categories = filteredCategories ;
        this.initializeForm();

      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

initializeForm() {
  const categoryGroup = this.updateForm.get('categories') as FormGroup;
  
  Object.keys(this.categories).forEach(category => {
    const subcategories = this.categories[category];
    const categorySubGroup = this.fb.group({});

    Object.keys(subcategories).forEach(subcategory => {
      const subcategoryData = subcategories[subcategory];
      if (subcategoryData.type === 'checkbox') {
        // Assuming checkboxes are arrays
        categorySubGroup.addControl(subcategory, this.fb.control(this.profile[category]?.[subcategory] || []));
      } else {
        categorySubGroup.addControl(subcategory, this.fb.control(this.profile[category]?.[subcategory] || ''));
      }
    });

    categoryGroup.addControl(category, categorySubGroup);
  });

  // Also patch the standalone fields like jobDescription if needed
  this.updateForm.patchValue({
    name: this.profile?.name || '',
  email:  this.profile?.email || '',
  phone_number: this.profile?.phone_number || '',
  job_title: this.profile?.job_title || '',
  company_name: this.profile?.company_name || '',
  company_address: this.profile?.company_address || '',

  });
}




  fetchTotalJobs(): void {
    forkJoin({
      api1: this.consultantservice.getJobsFromAPI1(),
      api2: this.consultantservice.getJobsFromAPI2(),
      api3: this.consultantservice.getJobsFromAPI3()
    }).subscribe({
      next: ({ api1, api2, api3 }) => {
        // Debug logs
        console.log('API 1 jobs:', api1);
        console.log('API 2 jobs:', api2);
        console.log('API 3 jobs:', api3);
  
        // Extract and count jobs
        const api1Jobs = api1?.pending_bids || [];
        const api2Jobs = api2?.jobs_in_progress || [];
        const api3Jobs = api3?.completed_jobs || [];
  
         this.total_jobs = api1Jobs.length + api2Jobs.length + api3Jobs.length;
         this.active_jobs = api2Jobs.length; // Assuming active jobs are from API 2
        this.completed_jobs = api3Jobs.length; // Assuming completed jobs are from API 3
  
        console.log('Total jobs from all APIs:', this.total_jobs);
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.profile = JSON.parse(JSON.stringify(this.originalProfile));
    this.editMode = false;
  }


  saveProfile(): void {
    console.log("Form values before saving:", this.updateForm.value);
    const formValues = this.updateForm.value; // 🧃 get the current form data

    
  const flatCategoriesPayload: any = {
    environmental_services: [],
    property_transactions: [],
    field_activities: [],
    hazardous_materials: [],
    safety_facility_compliance: [],
    industrial_hygiene: [],
    construction_safety: []
  };

  const parentToFlatField: { [key: string]: keyof typeof flatCategoriesPayload } = {
    'Environmental Services Expertise': 'environmental_services',
    'Property Transactions': 'property_transactions',
    'Field Activities / Construction': 'field_activities',
    'Hazardous Building Materials Surveys': 'hazardous_materials',
    'Safety Facility Compliance': 'safety_facility_compliance',
    'Industrial Hygiene': 'industrial_hygiene',
    'Construction Safety': 'construction_safety'
  };

  // Object.keys(formValues.categories || {}).forEach(parentCategory => {
  //   const flatField = parentToFlatField[parentCategory];
  //   const subcategories = formValues.categories[parentCategory];

  //   console.log(`Processing parent category: ${parentCategory} -> Flat field: ${String(flatField)}`, subcategories);

  //   if (flatField && subcategories) {
  //     Object.keys(subcategories || {}).forEach(subcategory => {
  //       const selectedOptions = subcategories[subcategory];
  //       if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
  //         flatCategoriesPayload[flatField].push(...selectedOptions);
  //       }
  //     });
  //   }
  // });
  Object.keys(formValues.categories || {}).forEach(parentCategory => {
    const flatField = parentToFlatField[parentCategory];
    const subcategoryGroups = formValues.categories[parentCategory];
  
    console.log(`Processing parent category: ${parentCategory} -> Flat field: ${String(flatField)}`, subcategoryGroups);
  
    if (flatField && subcategoryGroups) {
      Object.keys(subcategoryGroups || {}).forEach(subcategoryGroup => {
        console.log(`Processing subcategory group: ${subcategoryGroup}`, subcategoryGroups[subcategoryGroup]);
        const selectedOptions = subcategoryGroups[subcategoryGroup];
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
          flatCategoriesPayload[flatField].push(...selectedOptions);
        }
      });
    }
  });

  console.log('Flat categories payload:', flatCategoriesPayload);
  
  
    const consultant_data_str = {
      name: formValues.name,
      job_title: formValues.job_title,
      company_name: formValues.company_name,
      company_address: formValues.company_address,
      phone_number: formValues.phone_number,
      ...flatCategoriesPayload,
      written_responses: {
        'Please state any specifics about availability that you may have': this.profile.written_responses?.['Please state any specifics about availability that you may have'] || '',
        'Additional Information, Comments or Clarifications': this.profile.written_responses?.['Additional Information, Comments or Clarifications'] || ''
      }
    };

    // 🧃 Create FormData instead of plain object
   
    
  const formData = new FormData();
  formData.append('consultant_data_str', JSON.stringify(consultant_data_str));

  // for (const pair of formData.entries()) {
  //   console.log(`${pair[0]}: ${pair[1]}`);
  // }

    this.consultantservice.updateProfile(formData).subscribe({
      next: () => {
        const snackBarRef = this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 1000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        // this.editMode = false;
        // this.loadProfile();
        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });

        setTimeout(() => {
          this.editMode = false;
          this.loadProfile();
        }, 100);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.snackBar.open('Failed to update profile.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }


  onCategoryFileSelected(event: Event, categoryKey: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (!this.categoryFiles[categoryKey]) {
        this.categoryFiles[categoryKey] = [];
      }
      this.categoryFiles[categoryKey].push(...Array.from(input.files));
    }
    console.log(`Files selected for category ${categoryKey}:`, this.categoryFiles[categoryKey]);
  }

  removeCategoryFile(categoryKey: string, index: number): void {
    this.categoryFiles[categoryKey].splice(index, 1);
  }

  /**
   * Append each file under its main category as an array in FormData.
   */
uploadFiles() {
  const formDataObject: { [key: string]: any } = {};

  const formData = new FormData(); // Declare and initialize FormData

  Object.keys(this.categoryFiles).forEach(categoryKey => {
    const snakeCaseKey = this.toSnakeCase(categoryKey);
    
    // Use array notation for multiple files
    formDataObject[`${snakeCaseKey}`] = this.categoryFiles[categoryKey];
    
    this.categoryFiles[categoryKey].forEach(file => {
      console.log(`Adding file ${file.name} to category ${snakeCaseKey}`);
      formData.append(`${snakeCaseKey}[]`, file);
    });
  });
}

private toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]+/g, '');
}
}
