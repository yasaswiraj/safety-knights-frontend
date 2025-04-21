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
  formStructure: any;                    // server schema
  clientResponses: any;                  // existing answers
  jobForm!: FormGroup;                   // reactive form
  optionsCache: Record<number, Observable<string[]>> = {};

  /* ids we need for the special Insurance‑Coverage sync */
  private insuranceQuestionId = 7;
  private textGroupId!: number;

  constructor(
    private fb: FormBuilder,
    private formsService: FormsService,
    private clientService: ClientService,
    private router: Router // Added router injection
  ) { }

  ngOnInit() {
    const respId = history.state?.client_response_id;
    if (!respId) this.router.navigate(['/client/pending-bids']);
    else {
      forkJoin({
        structure: this.formsService.getFormStructure(1),
        responses: this.formsService.getClientResponsesDetailed(respId),
      }).subscribe(({ structure, responses }) => {
        this.formStructure = structure;
        this.clientResponses = responses;
        this.buildJobForm(structure);
      });
    }
  }


  private buildJobForm(structure: any) {
    const group: Record<string, FormControl | FormArray<any>> = {};

    structure.categories.forEach((cat: any) => {
      cat.questions.forEach((q: any) => {
        const pref = this.prefilledValue(q.question_id);

        switch (q.answer_type) {
          // text / date / radio
          case 'text':
          case 'date':
          case 'radio':
            group[q.question_id] = this.fb.control(pref ?? '');
            break;
          // CHECKBOX_GROUP
          case 'CHECKBOX_GROUP': {
            const chosen = pref ? String(pref).split(/\s*,\s*/) : [];
            group[q.question_id] = this.fb.array(
              chosen.map((val: string) => this.fb.control(val))
            );
            break;
          }
          // TEXT_GROUP (coverage inputs)
          case 'TEXT_GROUP': {
            this.textGroupId = q.question_id;
            const vals = pref ? String(pref).split(/\s*,\s*/) : [];
            group[q.question_id] = this.fb.array(
              vals.map((v: string) => this.fb.control(v))
            );
            break;
          }
          default:
            group[q.question_id] = this.fb.control(pref ?? '');
        }
      });
    });

    this.jobForm = this.fb.group(group);
  }

  /** read existing answer for a question‑id */
  private prefilledValue(qId: number) {
    for (const cat of this.clientResponses.categories || []) {
      const resp = cat.responses.find((r: any) => r.question_id === qId);
      if (resp) return resp.response_value;
    }
    return null;
  }

  /** ---------  Checkbox handler (qId 7 = Insurance)  --------------------- */
  toggleCheckbox(qId: number, option: string, checked: boolean) {
    const boxArray = this.jobForm.get(qId.toString()) as FormArray<FormControl>;
    const i = boxArray.controls.findIndex(c => c.value === option);
    if (checked) {
      boxArray.push(this.fb.control(option));
    } else {
      if (i !== -1) boxArray.removeAt(i);
    }

    if (qId === this.insuranceQuestionId) {
      const coverageArray = this.jobForm.get(this.textGroupId.toString()) as FormArray<FormControl>;

      if (checked) {
        coverageArray.push(this.fb.control(''));
      } else {
        if (i !== -1) coverageArray.removeAt(i);
      }
    }
  }

  /** convenience for template */
  getTextGroupControls(qId: number) {
    return (this.jobForm.get(qId.toString()) as FormArray)?.controls;
  }

  /** lazy‑load options */
  getOptions(qId: number): Observable<string[]> {
    if (!this.optionsCache[qId]) {
      this.optionsCache[qId] = this.formsService.getOptionsForQuestion(qId).pipe(
        map((d: any) => d.options),
        tap((opts) => console.log(`Fetched options for q${qId}:`, opts))
      );
    }
    return this.optionsCache[qId];
  }

  /** Collect payload and send to backend */
  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const responses = Object.entries(this.jobForm.value)
      .filter(([_, v]) => !(Array.isArray(v) && v.length === 0) && v !== '')
      .map(([id, val]) => ({
        question_id: +id,
        response_value: Array.isArray(val) ? val.join(', ') : val,
      }));

    const payload = { form_id: this.formStructure.form_id, responses };
    console.log(' update‑job payload', payload);
    console.log(' client_response_id', this.clientResponses.client_response_id);
    // TODO: call update endpoint
    this.clientService.updateJobWithResponses(this.clientResponses.client_response_id, payload).subscribe({
      next: (response) => {
        console.log('Job updated successfully:', response);
        this.router.navigate(['/client/pending-bids']);
      },
      error: (err) => {
        console.error('Job update failed:', err);
      }
    });
  }

  // Add getter to simplify access to the insurance FormArray for TEXT_GROUP fields
  get insuranceFormArray(): FormArray {
    return this.jobForm.get(this.insuranceQuestionId.toString()) as FormArray;
  }

  // New function to check if checkbox option is selected
  isCheckboxChecked(questionId: number, option: string): boolean {
    const boxArray = this.jobForm.get(questionId.toString()) as FormArray;
    return boxArray ? boxArray.value.includes(option) : false;
  }
}
