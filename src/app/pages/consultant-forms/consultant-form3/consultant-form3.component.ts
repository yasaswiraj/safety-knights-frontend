import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormDataService } from '../../../services/form-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
    ReactiveFormsModule
  ]
})
export class ConsultantForm3Component implements OnInit {
  signUpForm!: FormGroup;
   categories: Record<string, Record<string, { type: string; option?: string[] }>> = {};
  selectedFiles: File[] = [];
  categoryFiles: { [key: string]: File[] } = {};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formDataService: FormDataService,
    private http: HttpClient
  ) {
    this.signUpForm = this.fb.group({
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
    Object.keys(this.categories).forEach(category => {
      const subcategories = this.categories[category];
      const categorySubGroup = this.fb.group({});

      Object.keys(subcategories).forEach(subcategory => {
        const subcategoryData = subcategories[subcategory];
        if (subcategoryData.type === 'checkbox') {
          categorySubGroup.addControl(subcategory, this.fb.array([]));
        } else {
          categorySubGroup.addControl(subcategory, this.fb.control(''));
        }
      });

      categoryGroup.addControl(category, categorySubGroup);
    });
  }



onCategoryFileSelected(event: Event, categoryKey: string): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    if (!this.categoryFiles[categoryKey]) {
      this.categoryFiles[categoryKey] = [];
    }

    // You can adjust this to allow multiple files if needed
    this.categoryFiles[categoryKey].push(...Array.from(input.files));
  }
}

removeCategoryFile(categoryKey: string, index: number): void {
  this.categoryFiles[categoryKey].splice(index, 1);
}

uploadFiles() {
  const formData = new FormData();
  const fileMap: Record<string, string[]> = {};

  Object.keys(this.categoryFiles).forEach((categoryKey) => {
    const snakeCaseKey = this.toSnakeCase(categoryKey);
    const files = this.categoryFiles[categoryKey];

    console.log(`Uploading files for category: ${categoryKey} (${snakeCaseKey})`, files);

    fileMap[snakeCaseKey] = [];

    files.forEach((file, index) => {
      const fieldKey = `${snakeCaseKey}_${index}`;
      formData.append(fieldKey, file); // This stores the actual files
      fileMap[snakeCaseKey].push(fieldKey); // Keep track of the file keys
    });
  });

  // Attach the fileMap JSON as metadata to know which keys belong to which category
  formData.append('fileCategoryMap', JSON.stringify(fileMap));

  console.log('FormData prepared for upload:', formData);

  // Optional: Store locally or in service
  this.formDataService.setFormData({
    categoryFiles: this.categoryFiles,
    fileCategoryMap: fileMap
  });


}



  // uploadFiles() {
  //   const formData = new FormData();
  //   this.selectedFiles.forEach((file) => {
  //     formData.append('files', file);

  //   });

  //   this.formDataService.setFormData({ files: this.selectedFiles });

    
  // }

  

  private processFormData(): any {
    const rawData = this.signUpForm.value;
    const processedData: any = {
      jobDescription: rawData.jobDescription,
      files: this.selectedFiles.map(f => f.name)
    };

    Object.keys(this.categories).forEach(categoryName => {
      const snakeKey = this.toSnakeCase(categoryName);
      const categoryValues = this.getCategoryValues(categoryName);
      
      if (categoryValues.length > 0) {
        processedData[snakeKey] = categoryValues;
      }
    });

      
      const fileMeta = this.formDataService.getFormData();
      if (fileMeta?.fileNamesMap) {
        processedData.files = fileMeta.fileNamesMap;
      }

    return processedData;
  }

  private getCategoryValues(categoryName: string): string[] {
    const categoryGroup = this.signUpForm.get(`categories.${categoryName}`) as FormGroup;
    const values: string[] = [];

    Object.keys(categoryGroup.controls).forEach(controlName => {
      const control = categoryGroup.get(controlName);
      if (control instanceof FormArray) {
        values.push(...control.value);
      } else if (control?.value) {
        values.push(control.value);
      }
    });

    return values;
  }

  private toSnakeCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]+/g, '');
  }

  navigateToPreviousForm() {
    this.router.navigate(['/consultant-form-contact']);
  }

  navigateToNextForm() {
    const formData = this.processFormData();
    this.formDataService.setFormData(formData);
    console.log('Form data with files before navigation:', formData);
    this.router.navigate(['/consultant-form8']);
  }
}
