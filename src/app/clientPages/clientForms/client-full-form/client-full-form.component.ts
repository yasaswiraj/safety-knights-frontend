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

    // Special case for known fields that should be checkboxes
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

  onScopeOfServiceChange(selectedOptions: string[]) {
    this.showScopeOtherInput = selectedOptions.includes('Other...');
  }


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
    private formDataService: FormDataService
  ) { }

  ngOnInit() {
    const jobId = this.formDataService.getJobId();
    const formData = this.formDataService.getFormData();

    this.clientJobsService.getFormStructure().subscribe({
      next: (response) => {
        this.formStructure = response.form;
        this.categories = Object.keys(this.formStructure);
        this.buildForm();

        if (formData && jobId) {
          this.jobIdToEdit = jobId;
          this.prefillForm(formData);
        }

        this.isLoading = false;
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

        // Apply required validator for all except the 2 optional fields
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
    const checkFormReady = setInterval(() => {
      if (this.clientForm) {
        this.clientForm.patchValue({
          ...data
        });
        clearInterval(checkFormReady);
      }
    }, 100);
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
    const rawForm = this.clientForm.value;

    const formPayload: any = {};

    Object.keys(rawForm).forEach(camelKey => {
      const snakeKey = this.camelToSnakeCase(camelKey);
      let value = rawForm[camelKey];

      //Convert array (checkbox) to comma-separated string
      if (Array.isArray(value)) {
        value = value.join(', ');
      }

      if (snakeKey === 'budget') {
        value = parseFloat(value);
      }

      formPayload[snakeKey] = value;
    });




    const request$ = this.jobIdToEdit
      ? this.clientJobsService.updateJob(this.jobIdToEdit, formPayload)
      : this.clientJobsService.submitForm(formPayload);

    request$.subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/client/pending-bids']);
        }, 300);
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
