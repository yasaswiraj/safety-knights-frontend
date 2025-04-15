import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ClientJobsService } from '../../../services/client-jobs.service';
import { Router } from '@angular/router';
import { FormDataService } from '../../../services/form-data.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { LoadingComponent } from "../../../components/loading/loading.component";

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
  clientForm!: FormGroup;
  uploadedFile: File | null = null;
  formStructure: Record<string, Record<string, QuestionConfig>> = {};
  categories: string[] = [];
  question: any;
  isSubmitting = false;


  jobIdToEdit: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientJobsService: ClientJobsService,
    private router: Router,
    private formDataService: FormDataService
  ) { }

  readonly categoryOrder = [
    'Project Scope and Requirements',
    'Project Requirements',
    'Preferences and Commitments'
  ];

  readonly questionOrderMap: { [category: string]: string[] } = {
    'Project Scope and Requirements': [
      'Scope of Service Needed',
      'Please describe the work in detail',
      'Project Location',
      'Proposal Deadline',
      'When do you need the work conducted?',
      'Budget for Service'
    ],
    'Project Requirements': [
      'Insurance Requirements for the Contractor',
      'Payment Terms',
      'Preferred Method of Payment to Contractor'
    ],
    'Preferences and Commitments': [
      'Do you have any preferences regarding which contractors should not be considered?'
    ]

  };

  showScopeOfServiceOther = false;
  scopeOfServiceOtherText = '';

  showOtherInputs: { [key: string]: boolean } = {};
  otherInputs: { [key: string]: string } = {};


  readonly excludedQuestions = [
    'If the proposal is within budget, would you commit to moving forward?'
  ];

  ngOnInit() {
    const jobId = this.formDataService.getJobId();
    const formData = this.formDataService.getFormData();

    this.clientJobsService.getFormStructure().subscribe({
      next: (response) => {
        this.formStructure = response.form;
        this.categories = this.categoryOrder.filter(category => {
          const allQuestions = this.formStructure[category];
          if (!allQuestions) return false;
          const hasVisible = Object.keys(allQuestions).some(
            (q) =>
              !this.excludedQuestions.includes(q) &&
              this.questionOrderMap[category]?.includes(q)
          );
          return hasVisible;
        });

        this.buildForm();

        if (formData && jobId) {
          this.jobIdToEdit = jobId;
          this.prefillForm(formData);
        }
      },
      error: (err) => console.error('Failed to fetch form structure:', err)
    });
  }


  prefillForm(data: any) {
    const checkFormReady = setInterval(() => {
      if (this.clientForm && this.clientForm.contains('proposalDeadline') && this.clientForm.contains('whenDoYouNeedTheWorkConducted')) {
        this.clientForm.patchValue({
          scopeOfServiceNeeded: data.scopeOfService || [],
          pleaseDescribeTheWorkInDetail: data.jobDescription || '',
          projectLocation: data.location || '',
          proposalDeadline: data.deadline || '',
          whenDoYouNeedTheWorkConducted: data.projectStartDate || '',
          budgetForService: data.budget || '',
          insuranceRequirementsForTheContractor: data.selectedInsurances || [],
          paymentTerms: data.payment_terms || '',
          preferredMethodOfPaymentToContractor: data.payment_method || '',
          doYouHaveAnyPreferencesRegardingWhichContractorsShouldNotBeConsidered: data.contractor_preferences || '',

        });

        if (data.payment_terms === 'Other...') {
          this.showOtherInputs['paymentTerms'] = true;
          this.otherInputs['paymentTerms'] = '';
        }

        if (data.insuranceCoverageDetails) {
          this.insuranceCoverageMap = { ...data.insuranceCoverageDetails };
        }
        if (data.selectedInsurances?.length) {
          this.selectedInsuranceOptions = data.selectedInsurances;
        }


        if (data.payment_method === 'Other...') {
          this.showOtherInputs['preferredMethodOfPaymentToContractor'] = true;
          this.otherInputs['preferredMethodOfPaymentToContractor'] = '';
        }

        clearInterval(checkFormReady); // stop checking once form is patched
      }
    }, 100);
  }




  getQuestionEntries(category: string): { key: string; value: QuestionConfig }[] {
    const entries = this.formStructure[category];
    const order = this.questionOrderMap[category] || [];

    return order
      .filter((key) => entries[key] && !this.excludedQuestions.includes(key))
      .map((key) => ({ key, value: entries[key] }));
  }

  selectedInsuranceOptions: string[] = [];
  insuranceCoverageMap: { [key: string]: string } = {};

  onInsuranceSelectChange(selectedOptions: string[]) {
    this.selectedInsuranceOptions = selectedOptions;

    // Remove coverage entries for deselected options
    for (const key of Object.keys(this.insuranceCoverageMap)) {
      if (!selectedOptions.includes(key)) {
        delete this.insuranceCoverageMap[key];
      }
    }
  }



  buildForm() {
    const controls: { [key: string]: any } = {};

    for (const category of this.categories) {
      const questions = this.formStructure[category];
      for (const questionKey of Object.keys(questions)) {
        if (this.excludedQuestions.includes(questionKey)) continue;

        const question = questions[questionKey];
        const formKey = this.camelCase(questionKey);

        // Mark as required unless it's one of the exceptions
        const isRequired = questionKey !== 'Insurance Requirements for the Contractor' &&
          questionKey !== 'Please describe the work in detail' &&
          questionKey !== 'Do you have any preferences regarding which contractors should not be considered?';


        if (questionKey === 'Scope of Service Needed' || questionKey === 'Insurance Requirements for the Contractor') {
          controls[formKey] = [[], isRequired ? Validators.required : []];
        }
        else if (['text', 'radio', 'checkbox'].includes(question.type)) {
          controls[formKey] = [[], isRequired ? Validators.required : []];
        } else if (question.type === 'date') {
          controls[formKey] = [
            '',
            Validators.compose([
              Validators.required,
              this.noPastDateValidator()
            ])
          ];
        }

      }
    }

    this.clientForm = this.fb.group(controls, {
      validators: this.dateOrderValidator()
    });

    console.log('Form controls:', Object.keys(this.clientForm.controls));
    console.log('Questions in Preferences and Commitments:', this.formStructure['Preferences and Commitments']);

  }

  isFieldRequired(key: string): boolean {
    return key !== 'Insurance Requirements for the Contractor' &&
           key !== 'Do you have any preferences regarding which contractors should not be considered?';
  }
  

  noPastDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize

      if (selectedDate < today) {
        return { pastDate: true };
      }
      return null;
    };
  }
  dateOrderValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const proposal = group.get('proposalDeadline')?.value;
      const start = group.get('whenDoYouNeedTheWorkConducted')?.value;

      if (proposal && start && new Date(proposal) > new Date(start)) {
        return { proposalBeforeStart: true };
      }
      return null;
    };
  }



  onMultiSelectChange(selectedValues: string[], field: string) {
    this.showScopeOfServiceOther = selectedValues.includes('Other...');
  }

  onRadioChange(fieldName: string) {
    const selected = this.clientForm.get(fieldName)?.value;
    this.showOtherInputs[fieldName] = selected === 'Other...';
  }


  trackByQuestionKey(index: number, item: { key: string, value: QuestionConfig }): string {
    return item.key;
  }

  onCheckboxChange(event: any, fieldName: string) {
    const control = this.clientForm.get(fieldName);
    if (!control) return;

    const currentValues = control.value || [];
    const value = event.target.value;

    if (event.target.checked) {
      control.setValue([...currentValues, value]);
    } else {
      control.setValue(currentValues.filter((v: string) => v !== value));
    }

    // Show custom input field if 'Other' is selected
    this.showOtherInputs[fieldName] = control.value.includes('Other');
  }


  camelCase(label: string): string {
    return label
      .replace(/[^\w\s]/g, '') // remove punctuation (e.g., '?')
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^(.)/, (match, group1) => group1.toLowerCase());
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

    const selectedServices = rawForm.scopeOfServiceNeeded || [];
    const scopeServices = selectedServices.includes('Other...') && this.scopeOfServiceOtherText
      ? [...(selectedServices.filter((s: string) => s !== 'Other...')), this.scopeOfServiceOtherText]
      : selectedServices;

    const insuranceReq = rawForm.insuranceRequirementsForTheContractor || [];

    const paymentTerms = rawForm.paymentTerms === 'Other...'
      ? this.otherInputs['paymentTerms']
      : rawForm.paymentTerms;

    const paymentMethod = rawForm.preferredMethodOfPaymentToContractor === 'Other...'
      ? this.otherInputs['preferredMethodOfPaymentToContractor']
      : rawForm.preferredMethodOfPaymentToContractor;

    const formPayload: any = {
      scope_of_service: scopeServices.join(', '),
      work_in_detail: rawForm.pleaseDescribeTheWorkInDetail,
      project_location: rawForm.projectLocation,
      proposal_deadline: rawForm.proposalDeadline,
      expected_start_date: rawForm.whenDoYouNeedTheWorkConducted,
      budget: parseFloat(rawForm.budgetForService),
      insurance_requirements: Array.isArray(insuranceReq) ? insuranceReq.join(', ') : '',
      insurance_coverage_details: this.insuranceCoverageMap,
      payment_terms: paymentTerms,
      payment_method: paymentMethod,
      uploadedFileName: this.uploadedFile?.name || ''
    };

    const contractorPref = rawForm.doYouHaveAnyPreferencesRegardingWhichContractorsShouldNotBeConsidered;
    if (typeof contractorPref === 'string' && contractorPref.trim()) {
      formPayload.contractor_preferences = contractorPref.trim();
    }


    // Add edit-specific fields
    if (this.jobIdToEdit) {
      formPayload.contractor_preferences = this.otherInputs['contractorPreferences'] !== undefined
        ? this.otherInputs['contractorPreferences']
        : formPayload.contractor_preferences;
      formPayload.commitment_to_proceed = this.otherInputs['commitmentToProceed'] || '';
    }

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

  formatToDateOnly(dateInput: string | Date): string {
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }

  onInsuranceCheckboxChange(event: Event, fieldName: string): void {
    const control = this.clientForm.get(fieldName);
    if (!control) return;

    const target = event.target as HTMLInputElement;
    const currentValues = control.value || [];
    const value = target.value;

    if (target.checked) {
      control.setValue([...currentValues, value]);
    } else {
      control.setValue(currentValues.filter((v: string) => v !== value));
      delete this.insuranceCoverageMap[value];
    }
  }

  normalizeType(key: string, type: string): string {
    const map: { [key: string]: string } = {
      CHECKBOX_GROUP: 'checkbox',
      RADIO_GROUP: 'radio'
    };

    if (key === 'Insurance Requirements for the Contractor') {
      return 'checkbox';
    }

    return map[type] || type;
  }

}

export interface QuestionConfig {
  type: 'text' | 'date' | 'radio' | 'checkbox' | 'CHECKBOX_GROUP' | 'RADIO_GROUP';
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}




