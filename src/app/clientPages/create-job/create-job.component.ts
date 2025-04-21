import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormDataService } from '../../services/form-data.service';
import { FormsService } from '../../services/forms.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.css'
})
export class CreateJobComponent implements OnInit {
  formStructure: any;
  jobForm!: FormGroup;
  optionsCache: { [questionId: number]: Observable<string[]> } = {};
  private textGroupId!: number;
  private insuranceQuestionId = 7;
  uploadedFile: File | null = null;
  isOtherSelected: { [questionId: number]: boolean } = {};
  otherInputControls: { [questionId: number]: FormControl } = {};


  constructor(
    private fb: FormBuilder,
    public formDataService: FormDataService,
    public formsService: FormsService,
    private router: Router,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.formsService.getFormStructure(1).subscribe(struct => {
      this.formStructure = struct;
      this.buildJobForm(struct);
    });
  }

  private buildJobForm(structure: any) {
    const group: { [controlName: string]: FormControl | FormArray<any> } = {};

    structure.categories.forEach((cat: any) => {
      cat.questions.forEach((q: any) => {
        const validators = [];

        if (q.answer_type === 'CHECKBOX_GROUP') {
          group[q.question_id] = this.fb.array<FormControl<string>>([]);
        } else if (q.answer_type === 'TEXT_GROUP') {
          this.textGroupId = q.question_id;
          group[q.question_id] = this.fb.array<FormControl<string>>([]);
        } else {
          // Apply past-date validator
          if (q.question_id === 4|| q.question_id === 5) {
            validators.push(this.noPastDateValidator());
          }

          group[q.question_id] = this.fb.control('', validators);
        }
      });
    });

    this.jobForm = this.fb.group(group, {
      validators: this.dateOrderValidator()
    });
  }


  getOptions(questionId: number): Observable<string[]> {
    if (!this.optionsCache[questionId]) {
      this.optionsCache[questionId] = this.formsService.getOptionsForQuestion(questionId).pipe(
        map((data: any) => data.options),
        tap(options => console.log(`Fetched options for question ${questionId}:`, options))
      );
    }
    return this.optionsCache[questionId];
  }

  isRequiredField(questionId: number): boolean {
    const optionalQuestionIds = [10, 7, 22];
    return !optionalQuestionIds.includes(questionId);
  }


  handleRadioChange(questionId: number, selectedValue: string) {
    const isOther = selectedValue.toLowerCase().includes('other');

    if (isOther) {
      this.isOtherSelected[questionId] = true;

      if (!this.otherInputControls[questionId]) {
        this.otherInputControls[questionId] = new FormControl('');
      }

      // Don't clear the value – leave "Other..." selected
    } else {
      this.isOtherSelected[questionId] = false;
    }
  }


  // When user types into the "Other..." field
  updateRadioValue(questionId: number) {
    const otherValue = this.otherInputControls[questionId]?.value;
    if (otherValue) {
      this.jobForm.get(questionId.toString())?.setValue(otherValue);
    }
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
    }
  }

  uploadJobDescriptionFile(jobId: number) {
    const formData = new FormData();

    formData.append('job_id', jobId.toString());
    formData.append('files', this.uploadedFile!);

    this.clientService.uploadJobFile(formData).subscribe({
      next: () => {
        console.log('File uploaded successfully');
        this.router.navigate(['/client/pending-bids']);
      },
      error: (err) => {
        console.error('File upload failed:', err);
      }
    });
  }

  noPastDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;
  
      const selected = new Date(value);
      const today = new Date();
  
      // Reset hours for strict date-only comparison
      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
  
      return selected < today ? { pastDate: true } : null;
    };
  }
  


  dateOrderValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const proposalControl = group.get('4');
      const workControl = group.get('5');


      if (!proposalControl || !workControl || !proposalControl.value || !workControl.value) return null;

      const proposalDate = new Date(proposalControl.value);
      const workDate = new Date(workControl.value);

      return proposalDate > workDate ? { proposalAfterWork: true } : null;
    };
  }




  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }
    const responses = Object.entries(this.jobForm.value)
      .filter(([_, v]) => v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
      .map(([qId, value]) => {
        const questionId = +qId;

        // For radio
        if (value === 'Other...' && this.otherInputControls[questionId]) {
          value = this.otherInputControls[questionId].value;
        }

        // For checkbox group
        if (Array.isArray(value) && value.includes('Other...') && this.otherInputControls[questionId]) {
          value = value.map((v: string) =>
            v === 'Other...' ? this.otherInputControls[questionId].value : v
          );
        }

        return {
          question_id: questionId,
          response_value: Array.isArray(value) ? value.join(', ') : value
        };
      });


    const payload = {
      form_id: this.formStructure.form_id,
      responses
    };

    this.clientService.createJobWithResponses(payload).subscribe({
      next: (response) => {
        const jobId = response.job_id;
        if (this.uploadedFile) {
          this.uploadJobDescriptionFile(jobId);
        } else {
          this.router.navigate(['/client/pending-bids']);
        }
      },
      error: (err) => {
        console.error('Job creation failed:', err);
      }
    });
  }


  toggleCheckbox(qId: number, option: string, checked: boolean) {
    const boxArray = this.jobForm.get(qId.toString()) as FormArray<FormControl>;
    const i = boxArray.controls.findIndex(c => c.value === option);

    if (checked) {
      boxArray.push(this.fb.control(option));
    } else {
      if (i !== -1) boxArray.removeAt(i);
    }

    // If 'Other...' is selected, show textbox
    if (option.toLowerCase().includes('other')) {
      this.isOtherSelected[qId] = checked;

      if (checked && !this.otherInputControls[qId]) {
        this.otherInputControls[qId] = new FormControl('');
      }
    }

    // Handle syncing TEXT_GROUP if this is insurance
    if (qId === this.insuranceQuestionId) {
      const coverageArray = this.jobForm.get(this.textGroupId.toString()) as FormArray<FormControl>;

      if (checked) {
        coverageArray.push(this.fb.control(''));
      } else {
        if (i !== -1) coverageArray.removeAt(i);
      }
    }
  }


  addTextGroupControl(questionId: string): void {
    (this.jobForm.get(questionId) as FormArray).push(this.fb.control(''));
  }

  addMinimumCoverage(questionId: string, coverage: string): void {
    const formArray = this.jobForm.get(questionId) as FormArray;
    if (formArray && formArray.length) {
      formArray.at(0).setValue(coverage);
    }
    console.log('Minimum coverage:', { questionId, coverage });
  }

  getTextGroupControls(questionId: number): FormArray {
    return this.jobForm.get(questionId.toString())! as FormArray;
  }

  // Updated method to support index parameter from template
  getInsuranceControlValue(index: number): string {
    const coverageArray = this.jobForm.get(this.insuranceQuestionId.toString()) as FormArray<FormControl>;
    return coverageArray.controls[index]?.value || '';
  }
}
