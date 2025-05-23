import { Component, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ClientJobsService } from '../../../services/client-jobs.service';
import { FormDataService } from '../../../services/form-data.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { FileUploadResponse } from '../../../services/client-jobs.service';
import { AuthService } from '../../../services/auth.service'; // adjust path as needed




@Component({
  selector: 'app-client-full-form',
  templateUrl: './client-full-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent
  ]
})
export class ClientFullFormComponent implements OnInit {
  normalizeType(key: string, type: string): string {
    const normalized = type.toLowerCase();
    if (normalized === 'radio_group') return 'radio';
    if (normalized === 'checkbox_group') return 'checkbox';
    if (key.toLowerCase().includes('insurance')) return 'checkbox';
    return normalized;
  }

  clientForm!: FormGroup;
  uploadedFile: File | null = null;
  formStructure: Record<string, Record<string, QuestionConfig>> = {};
  categories: string[] = [];
  isSubmitting = false;
  isLoading = true;

  showScopeOfServiceOther = false;
  scopeOfServiceOtherText = '';

  showScopeOtherInput: boolean = false;
  scopeOtherText: string = '';

  showOtherInputs: { [key: string]: boolean } = {};
  otherInputs: { [key: string]: string } = {};

  selectedInsuranceOptions: string[] = [];
  insuranceCoverageMap: { [key: string]: string } = {};

  jobIdToEdit: number | null = null;
  trackByQuestionKey(index: number, item: { key: string, value: QuestionConfig }): string {
    return item.key;
  }

  constructor(
    private fb: FormBuilder,
    private clientJobsService: ClientJobsService,
    private router: Router,
    private formDataService: FormDataService,
    private authService: AuthService // <-- add this
  ) { }

  ngOnInit() {
    const jobId = this.formDataService.getJobId();

    this.clientJobsService.getFormStructure().subscribe({
      next: (response) => {
        this.formStructure = response.form;
        this.categories = Object.keys(this.formStructure);
        this.buildForm();

        if (jobId) {
          this.jobIdToEdit = jobId;
          this.clientJobsService.getFilledForm(jobId).subscribe({
            next: (filledData) => {
              this.prefillForm(filledData?.filled_form);
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Failed to fetch filled form', err);
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        console.error('Failed to fetch form structure');
        this.isLoading = false;
      }
    });
  }

  buildForm() {
    const controls: { [key: string]: any } = {};

    for (const category of this.categories) {
      const questions = this.formStructure[category];
      for (const questionKey of Object.keys(questions)) {
        const question = questions[questionKey];
        const formKey = this.camelCase(questionKey);

        let validators = [];

        if (!['insurance_requirements', 'contractor_preferences'].includes(questionKey)) {
          validators.push(Validators.required);
        }

        switch (question.type) {
          case 'date':
            validators.push(this.noPastDateValidator());
            controls[formKey] = ['', Validators.compose(validators)];
            break;
          case 'text':
          case 'radio':
          case 'checkbox':
            controls[formKey] = [[], validators];
            break;
          default:
            controls[formKey] = [''];
        }
      }
    }

    this.clientForm = this.fb.group(controls, {
      validators: this.dateOrderValidator()
    });
  }

  prefillForm(data: any) {
    if (!data?.job_details) return;

    const patchObj: any = {
      work_in_detail: data.job_details.work_in_detail,
      project_location: data.job_details.project_location,
      proposal_deadline: data.job_details.proposal_deadline,
      expected_start_date: data.job_details.expected_start_date,
      budget: data.job_details.budget,
    };
    console.log('Prefilling form with data:', data);

    if (typeof data.job_details.scope_of_service === 'string') {
      patchObj.scope_of_service = data.job_details.scope_of_service
        .split(',')
        .map((s: string) => s.trim());
    }

    this.clientForm.patchValue(patchObj);

    if (data.job_details.responses?.length) {
      data.job_details.responses.forEach((resp: any) => {
        const key = this.camelCase(resp.question_key);
        const control = this.clientForm.get(key);
        if (!control) return;

        let value = resp.response_value;
        const questionConfig = this.getQuestionConfigByKey(key);
        const isMultiSelect = questionConfig?.type?.toLowerCase().includes('checkbox');

        if (typeof value === 'string' && isMultiSelect) {
          value = value.split(',').map((v: string) => v.trim());
        }

        control.setValue(value);
      });
    }
  }

  getQuestionConfigByKey(key: string): QuestionConfig | undefined {
    for (const category of this.categories) {
      const questions = this.formStructure[category];
      for (const questionKey in questions) {
        if (this.camelCase(questionKey) === key) {
          return questions[questionKey];
        }
      }
    }
    return undefined;
  }

  getQuestionEntries(category: string): { key: string; value: QuestionConfig }[] {
    const entries = this.formStructure[category];
    return Object.entries(entries).map(([key, value]) => ({ key, value }));
  }

  isFieldRequired(key: string): boolean {
    return !['insurance_requirements', 'contractor_preferences'].includes(key);
  }

  noPastDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate < today ? { pastDate: true } : null;
    };
  }

  dateOrderValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const proposal = group.get('proposalDeadline')?.value;
      const start = group.get('whenDoYouNeedTheWorkConducted')?.value;
      return proposal && start && new Date(proposal) > new Date(start)
        ? { proposalBeforeStart: true }
        : null;
    };
  }

  onMultiSelectChange(selectedValues: string[], field: string) {
    this.showScopeOfServiceOther = selectedValues.includes('Other...');
  }

  onRadioChange(fieldName: string) {
    const selected = this.clientForm.get(fieldName)?.value;
    this.showOtherInputs[fieldName] = selected === 'Other...';
  }

  onInsuranceSelectChange(selectedOptions: string[]) {
    this.selectedInsuranceOptions = selectedOptions;
    for (const key of Object.keys(this.insuranceCoverageMap)) {
      if (!selectedOptions.includes(key)) {
        delete this.insuranceCoverageMap[key];
      }
    }
  }

  onScopeOfServiceChange(selectedOptions: string[]) {
    this.showScopeOtherInput = selectedOptions.includes('Other...');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];
      this.clientForm.patchValue({ uploadedFile: this.uploadedFile });
    }
  }

  submitForm() {
    if (this.clientForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
  
    this.submitJobForm();  // Submit form first, then upload file after getting job_id
  }
  

  submitJobForm() {
    const rawForm = this.clientForm.value;
    const formPayload: any = {};
  
    Object.keys(rawForm).forEach(camelKey => {
      const snakeKey = this.camelToSnakeCase(camelKey);
      let value = rawForm[camelKey];
      if (Array.isArray(value)) value = value.join(', ');
      if (snakeKey === 'budget') value = parseFloat(value);
      formPayload[snakeKey] = value;
    });
  
    formPayload.responses = [];
  
    for (const category of this.categories) {
      const questions = this.formStructure[category];
      for (const questionKey of Object.keys(questions)) {
        const camelKey = this.camelCase(questionKey);
        const control = this.clientForm.get(camelKey);
        if (control && control.value !== undefined && control.value !== null) {
          let value = control.value;
          if (Array.isArray(value)) value = value.join(', ');
          value = String(value);
          formPayload.responses.push({
            question_key: questionKey,
            response_value: value
          });
        }
      }
    }
  
    const request$ = this.jobIdToEdit
  ? this.clientJobsService.updateJob(this.jobIdToEdit, formPayload)
  : this.clientJobsService.submitForm(formPayload);

request$.subscribe({
  next: (res) => {
    const jobId = res.job_id;
    if (this.uploadedFile) {
      const formData = new FormData();
      formData.append('job_id', jobId);
      formData.append('files', this.uploadedFile);
      formData.append('category', 'Job Description');

      this.clientJobsService.uploadFiles(formData).subscribe({
        next: () => this.router.navigate(['/client/pending-bids']),
        error: (e) => {
          console.error('File upload failed', e);
          this.isSubmitting = false;
        }
      });
    } else {
      this.router.navigate(['/client/pending-bids']);
    }
  },
  error: (error: any) => {
    console.error('Submission failed:', error);
    this.isSubmitting = false;
  }
});

  }

  camelCase(label: string): string {
    return label
      .replace(/[^\w\s]/g, '')
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^(.)/, (match, group1) => group1.toLowerCase());
  }

  camelToSnakeCase(input: string): string {
    return input.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

export interface QuestionConfig {
  type: 'text' | 'date' | 'radio' | 'checkbox' | 'CHECKBOX_GROUP' | 'RADIO_GROUP';
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}
