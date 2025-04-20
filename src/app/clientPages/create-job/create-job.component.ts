import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormDataService } from '../../services/form-data.service';
import { FormsService } from '../../services/forms.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

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

  constructor(
    private fb: FormBuilder,
    public formDataService: FormDataService,
    public formsService: FormsService,
    private router: Router,
    private clientService: ClientService
  ) {}

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
        if (q.answer_type === 'CHECKBOX_GROUP') {
          group[q.question_id] = this.fb.array<FormControl<string>>([]);
        } else if (q.answer_type === 'TEXT_GROUP') {
          this.textGroupId = q.question_id;
          group[q.question_id] = this.fb.array<FormControl<string>>([]);
        } else {
          group[q.question_id] = this.fb.control('');
        }
      });
    });

    this.jobForm = this.fb.group(group);
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

  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    const responses = Object.entries(this.jobForm.value)
      .filter(([_, v]) => v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
      .map(([qId, value]) => ({
        question_id: +qId,
        response_value: Array.isArray(value) ? value.join(', ') : value
      }));

    const payload = {
      form_id: this.formStructure.form_id,
      responses
    };

    console.log('Job Form Payload:', payload);

    this.clientService.createJobWithResponses(payload).subscribe(response => {
      console.log('Job created successfully:', response);
      this.router.navigate(['/client/bids-in-progress']);
    });
  }

  toggleCheckbox(qId: number, option: string, checked: boolean) {
    const boxArray = this.jobForm.get(qId.toString()) as FormArray<FormControl>;

    if (checked) {
      boxArray.push(this.fb.control(option));
    } else {
      const i = boxArray.controls.findIndex(c => c.value === option);
      if (i !== -1) boxArray.removeAt(i);
    }

    if (qId === this.insuranceQuestionId) {
      const coverageArray = this.jobForm.get(this.textGroupId.toString()) as FormArray<FormControl>;

      if (checked) {
        coverageArray.push(this.fb.control(''));
      } else {
        coverageArray.removeAt(coverageArray.length - (boxArray.length + 1));
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
