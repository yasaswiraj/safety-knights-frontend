import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ViewEncapsulation } from '@angular/core';
import { FormDataService } from '../../../services/form-data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-client-form3',
  templateUrl: './client-form3.component.html',
  styleUrls: ['./client-form3.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class ClientForm3Component {
  clientForm: FormGroup;
  services = ['Audit', 'Inspection', 'Compliance Assessment', 'Training'];
  uploadedFile: File | null = null;

  totalSteps = 3; // Total forms in the process
  currentStep = 1; // Update this for each form

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formDataService: FormDataService
  ) {
    this.clientForm = this.fb.group({
      scopeOfService: [[], Validators.required],
      jobDescription: ['', Validators.required],
      location: ['', Validators.required],
      deadline: ['', Validators.required],
      uploadedFile: [null]
    });
  }

  ngOnInit() {
    const data = this.formDataService.getFormData();
  
    if (data) {
      const formattedDeadline = this.formatDateToYYYYMMDD(data.deadline);
  
      this.clientForm.patchValue({
        scopeOfService: data.scopeOfService || [],
        jobDescription: data.jobDescription || '',
        location: data.location || '',
        deadline: formattedDeadline || '',  // 👈 ensure proper format
        uploadedFile: data.uploadedFile || null
      });
  
      this.uploadedFile = data.uploadedFile || null;
    }
  }
  

  minDate = new Date();
  dateError: string = '';

  validateDates() {
    const deadline = new Date(this.clientForm.value.deadline);
    const startDate = new Date(this.formDataService.getFormData()?.projectStartDate);

    if (startDate && deadline < startDate) {
      this.dateError = 'Proposal Deadline cannot be before Project Start Date.';
      this.clientForm.get('deadline')?.setErrors({ invalid: true });
    } else {
      this.dateError = '';
      this.clientForm.get('deadline')?.setErrors(null);
    }
  }


  formatDateToYYYYMMDD(dateInput: string | Date): string | null {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;

    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);

    return `${year}-${month}-${day}`;
  }



  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  navigateToNextForm() {
    if (this.clientForm.valid) {
      const deadlineValue = this.clientForm.value.deadline;
      const formattedDeadline = this.formatDateToYYYYMMDD(deadlineValue);
  
      this.formDataService.setFormData({
        ...this.formDataService.getFormData(),
        ...this.clientForm.value,
        deadline: formattedDeadline  // override with proper string
      });

      console.log('Form 3 data:', this.formDataService.getFormData());
  
      this.router.navigate(['/client/form-4']);
    }
  }
  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadedFile = file;
      this.clientForm.patchValue({ uploadedFile: file });
      this.formDataService.setUploadedFile(file);
    }
  }

}
