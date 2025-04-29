import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormDataService } from '../../../services/form-data.service';
import { FormsService }      from '../../../services/forms.service';
// import { ConsultantService } from '../../services/consultant.service'; // ➜ create / adapt
import { Router }            from '@angular/router';

@Component({
  selector: 'app-consultant-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultant-options.component.html',
  styleUrls: ['./consultant-options.component.css'],
})
export class ConsultantOptionsComponent implements OnInit {
  formStructure: any;                    // schema for form 2
  optionsForm!: FormGroup;               // reactive form
  optionsCache: Record<number, Observable<string[]>> = {};

  constructor(
    private fb: FormBuilder,
    private formsService: FormsService,
    // private consultantService: ConsultantService,
    private router: Router,
    private formDataService: FormDataService
  ) {}

  /* --------------------------------------------------------- */
  ngOnInit() {
    /* Consultant “options” form uses **form_id = 2** */
    this.formsService.getFormStructure(2).subscribe((struct) => {
      this.formStructure = struct;
      this.buildForm(struct);
    });
  }
  navigateToNextForm() {
    this.router.navigate(['/consultant-form8']);
  }

  navigateToPreviousForm() {
    this.router.navigate(['/consultant-form-contact']);
  }

  /* --------------- build generic reactive form ------------- */
  private buildForm(struct: any) {
    const group: Record<string, FormControl | FormArray<any>> = {};

    struct.categories.forEach((cat: any) => {
      cat.questions.forEach((q: any) => {
        switch (q.answer_type) {
          case 'CHECKBOX_GROUP':
            group[q.question_id] = this.fb.array<string>([]);
            break;

          default:
            group[q.question_id] = this.fb.control('');
        }
      });
    });

    this.optionsForm = this.fb.group(group);
  }

  /* -------------- lazy‑load options for radio/checkbox ------ */
  getOptions(qId: number): Observable<string[]> {
    if (!this.optionsCache[qId]) {
      this.optionsCache[qId] = this.formsService.getOptionsForQuestion(qId).pipe(
        map((d: any) => d.options),
        tap((o) => console.log(`Options for q${qId}`, o))
      );
    }
    return this.optionsCache[qId];
  }

  /* -------------- checkbox add / remove --------------------- */
  toggleCheckbox(qId: number, option: string, checked: boolean) {
    const arr = this.optionsForm.get(qId.toString()) as FormArray<FormControl>;
    if (checked) {
      arr.push(this.fb.control(option));
    } else {
      const idx = arr.controls.findIndex((c) => c.value === option);
      if (idx !== -1) arr.removeAt(idx);
    }
  }

  /* -------------- submit ------------------------------------ */
  onSubmit() {
    if (this.optionsForm.invalid) {
      this.optionsForm.markAllAsTouched();
      return;
    }

    const responses = Object.entries(this.optionsForm.value)
      .filter(([_, v]) => !(Array.isArray(v) && v.length === 0) && v !== '')
      .map(([id, v]) => ({
        question_id: +id,
        response_value: Array.isArray(v) ? v.join(', ') : v,
      }));

    const payload = { form_id: this.formStructure.form_id, responses };
    console.log('Consultant options payload', payload);

    // this.consultantService.submitConsultantOptions(payload).subscribe({
    //   next: () => this.router.navigate(['/consultant/dashboard']),
    //   error: (e) => console.error('Submit failed', e),
    // });
  }
}
