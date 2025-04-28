import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControl,
  ValidatorFn,
  FormControlOptions,
  Validators,
} from '@angular/forms';
import { FormsService } from '../../services/forms.service';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-job.component.html',
  styleUrl: './update-job.component.css',
})
export class UpdateJobComponent implements OnInit {
  formStructure: any;
  clientResponses: any;
  jobForm!: FormGroup;
  optionsCache: Record<number, Observable<string[]>> = {};

  private insuranceQuestionId = 7;
  private textGroupId!: number;
  uploadedFile: File | null = null;
  isOtherSelected: { [questionId: number]: boolean } = {};
  otherInputControls: { [questionId: number]: FormControl } = {};
  isSubmitting = false;
  uploadedFiles: { filename: string, download_url: string }[] = [];



  constructor(
    private fb: FormBuilder,
    private formsService: FormsService,
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit() {
    const respId = history.state?.client_response_id;
    const userId = history.state?.user_id;

    if (!respId || !userId) {
      this.router.navigate(['/client/pending-bids']);
    } else {
      forkJoin({
        structure: this.formsService.getFormStructure(1),
        responses: this.formsService.getClientResponsesDetailed(respId),
        files: this.clientService.getUserFilesForJob(userId, respId)
      }).subscribe(({ structure, responses, files }) => {
        this.formStructure = structure;
        this.clientResponses = responses;
        this.uploadedFiles = files?.files_by_category?.["Job Files"] || [];
        this.buildJobForm(structure);
      });
    }
  }


  private buildJobForm(structure: any) {
    const group: Record<string, FormControl | FormArray<any>> = {};
    const optionCalls: Observable<any>[] = [];
    const questionMap: any[] = [];

    // Collect all questions and option fetch calls
    structure.categories.forEach((cat: any) => {
      cat.questions.forEach((q: any) => {
        questionMap.push(q);
        optionCalls.push(this.getOptions(q.question_id));
      });
    });

    // Wait for all options to load
    forkJoin(optionCalls).subscribe((allOptionsResults) => {
      questionMap.forEach((q, idx) => {
        const pref = this.prefilledValue(q.question_id);
        const options = allOptionsResults[idx];
        const optionSet = new Set(options.map((o: string) => o.toLowerCase()));
        const isRequired = this.isRequiredField(q.question_id);
        const validators: ValidatorFn[] = [];

        if (q.question_id === 4 || q.question_id === 5) {
          validators.push(this.noPastDateValidator());
        }
        if (isRequired && q.answer_type !== 'CHECKBOX_GROUP') {
          validators.push(Validators.required);
        }

        if (q.answer_type === 'CHECKBOX_GROUP') {
          const chosen = pref ? String(pref).split(/\s*,\s*/) : [];
          const formArray = this.fb.array<FormControl>([], isRequired ? this.checkboxRequired() : undefined);
          const otherItems: string[] = [];

          chosen.forEach((val: string) => {
            if (optionSet.has(val.toLowerCase())) {
              formArray.push(this.fb.control(val));
            } else {
              this.isOtherSelected[q.question_id] = true;
              otherItems.push(val);
            }
          });

          if (this.isOtherSelected[q.question_id]) {
            this.otherInputControls[q.question_id] = new FormControl(otherItems.join(', '), Validators.required);
            formArray.push(this.fb.control('Other...'));
          }

          group[q.question_id] = formArray;

        } else if (q.answer_type === 'TEXT_GROUP') {
          this.textGroupId = q.question_id;
          const vals = pref ? String(pref).split(/\s*,\s*/) : [];
          group[q.question_id] = this.fb.array(vals.map(v => this.fb.control(v)));

        } else if (q.answer_type === 'radio') {
          let selected = pref ?? '';
          if (selected && !optionSet.has(selected.toLowerCase())) {
            this.isOtherSelected[q.question_id] = true;
            this.otherInputControls[q.question_id] = new FormControl(selected, Validators.required);
            selected = 'Other...';
          }
          group[q.question_id] = this.fb.control(selected, validators);

        } else {
          group[q.question_id] = this.fb.control(pref ?? '', validators);
        }
      });

      // Now build the full form once
      this.jobForm = this.fb.group(group, {
        validators: this.dateOrderValidator()
      });
    });
  }



  private prefilledValue(qId: number) {
    for (const cat of this.clientResponses.categories || []) {
      const resp = cat.responses.find((r: any) => r.question_id === qId);
      if (resp) return resp.response_value;
    }
    return null;
  }

  removeSelectedFile(): void {
    this.uploadedFile = null;
  }
  

  isRequiredField(questionId: number): boolean {
    const optionalQuestionIds = [10, 7, 22];
    return !optionalQuestionIds.includes(questionId);
  }

  toggleCheckbox(qId: number, option: string, checked: boolean) {
    const boxArray = this.jobForm.get(qId.toString()) as FormArray<FormControl>;
    const i = boxArray.controls.findIndex((c) => c.value === option);

    if (checked) {
      boxArray.push(this.fb.control(option));
    } else {
      if (i !== -1) boxArray.removeAt(i);
    }

    if (option.toLowerCase().includes('other')) {
      this.isOtherSelected[qId] = checked;
      if (checked && !this.otherInputControls[qId]) {
        this.otherInputControls[qId] = new FormControl('');
      }
    }

    if (qId === this.insuranceQuestionId) {
      const coverageArray = this.jobForm.get(
        this.textGroupId.toString()
      ) as FormArray<FormControl>;

      if (checked) {
        coverageArray.push(this.fb.control(''));
      } else {
        if (i !== -1) coverageArray.removeAt(i);
      }
    }
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

  getTextGroupControls(qId: number) {
    return (this.jobForm.get(qId.toString()) as FormArray)?.controls;
  }

  getOptions(qId: number): Observable<string[]> {
    if (!this.optionsCache[qId]) {
      this.optionsCache[qId] = this.formsService.getOptionsForQuestion(qId).pipe(
        map((d: any) => d.options),
        tap((opts) => console.log(`Fetched options for q${qId}:`, opts))
      );
    }
    return this.optionsCache[qId];
  }

  onSubmit() {
    if (this.jobForm.invalid || this.isSubmitting) {
      this.jobForm.markAllAsTouched();
      Object.values(this.otherInputControls).forEach(ctrl => ctrl?.markAsTouched?.());
      alert('Please fill in all required fields before submitting.');
      return;
    }

    this.isSubmitting = true;

    const responses = Object.entries(this.jobForm.value)
      .filter(([_, v]) => !(Array.isArray(v) && v.length === 0) && v !== '')
      .map(([id, val]) => {
        const qId = +id;
        if (val === 'Other...' && this.otherInputControls[qId]) {
          val = this.otherInputControls[qId].value;
        }
        if (
          Array.isArray(val) &&
          val.includes('Other...') &&
          this.otherInputControls[qId]
        ) {
          val = val.map((v: string) =>
            v === 'Other...' ? this.otherInputControls[qId].value : v
          );
        }
        return {
          question_id: qId,
          response_value: Array.isArray(val) ? val.join(', ') : val,
        };
      });

    const payload = {
      form_id: this.formStructure.form_id,
      responses,
    };

    const formData = new FormData();
    formData.append('job_data_str', JSON.stringify(payload));
    if (this.uploadedFile) {
      formData.append('files', this.uploadedFile);
    }

    this.clientService
      .updateJobWithResponses(this.clientResponses.client_response_id, formData)
      .subscribe({
        next: (res) => {
          console.log('Job updated successfully:', res);
          this.router.navigate(['/client/pending-bids']);
        },
        error: (err) => {
          console.error('Job update failed:', err);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  checkboxRequired(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      return (formArray as FormArray).length > 0 ? null : { required: true };
    };
  }



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
    }
  }

  noPastDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;

      const selected = new Date(value);
      const today = new Date();

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

  get insuranceFormArray(): FormArray {
    return this.jobForm.get(this.insuranceQuestionId.toString()) as FormArray;
  }

  isCheckboxChecked(questionId: number, option: string): boolean {
    const boxArray = this.jobForm.get(questionId.toString()) as FormArray;
    return boxArray ? boxArray.value.includes(option) : false;
  }
}
