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
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';

import { FormDataService } from '../../../services/form-data.service';
import { FormsService } from '../../../services/forms.service';
// import { ConsultantService } from '../../services/consultant.service'; // ➜ create / adapt
import { Router } from '@angular/router';

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
  isOtherSelected: { [questionId: number]: boolean } = {};
  otherInputControls: { [questionId: number]: FormControl } = {};
  isSubmitting = false;
  uploadedFile: File | null = null;
  uploadedFiles: File[] = [];
  currentFileQuestionId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private formsService: FormsService,
    // private consultantService: ConsultantService,
    private router: Router,
    private formDataService: FormDataService
  ) {}

  /* --------------------------------------------------------- */
  ngOnInit() {
    /* Consultant "options" form uses **form_id = 2** */
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
        const validators = [];

        if (q.answer_type === 'CHECKBOX_GROUP') {
          const checkboxArray = this.fb.array<FormControl<string>>([]);
          if (this.isRequiredField(q.question_id)) {
            checkboxArray.setValidators(this.checkboxRequired());
          }
          group[q.question_id] = checkboxArray;
        } else if (q.answer_type === 'radio') {
          if (this.isRequiredField(q.question_id)) {
            validators.push(Validators.required);
          }
          group[q.question_id] = this.fb.control('', validators);
        } else if (q.answer_type === 'file') {
          // For file uploads, we don't need form validation as we handle it separately
          group[q.question_id] = this.fb.control('');
        } else {
          if (this.isRequiredField(q.question_id)) {
            validators.push(Validators.required);
          }
          group[q.question_id] = this.fb.control('', validators);
        }
      });
    });

    this.optionsForm = this.fb.group(group);
  }

  isRequiredField(questionId: number): boolean {
    // Define which fields are optional - adjust as needed
    const optionalQuestionIds: number[] = [];
    
    // Find the question in the form structure
    for (const category of this.formStructure.categories) {
      for (const question of category.questions) {
        if (question.question_id === questionId) {
          // File uploads are always optional
          if (question.answer_type === 'file') {
            return false;
          }
        }
      }
    }
    
    return !optionalQuestionIds.includes(questionId);
  }

  checkboxRequired(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      return (formArray as FormArray).length > 0 ? null : { required: true };
    };
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

    // If 'Other...' is selected, show textbox
    if (option.toLowerCase().includes('other')) {
      this.isOtherSelected[qId] = checked;

      if (checked && !this.otherInputControls[qId]) {
        this.otherInputControls[qId] = new FormControl('', Validators.required);
      }
    }
  }

  handleRadioChange(questionId: number, selectedValue: string) {
    const isOther = selectedValue.toLowerCase().includes('other');
  
    if (isOther) {
      this.isOtherSelected[questionId] = true;
  
      if (!this.otherInputControls[questionId]) {
        this.otherInputControls[questionId] = new FormControl('', Validators.required);
      }
    } else {
      this.isOtherSelected[questionId] = false;
  
      // Optional: Reset or clear the otherInputControl when not in use
      if (this.otherInputControls[questionId]) {
        this.otherInputControls[questionId].setValue('');
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
      this.uploadedFiles.push(this.uploadedFile);
    }
  }

  removeSelectedFile(): void {
    if (this.uploadedFile) {
      const index = this.uploadedFiles.indexOf(this.uploadedFile);
      if (index > -1) {
        this.uploadedFiles.splice(index, 1);
      }
      this.uploadedFile = null;
    }
  }

  removeFile(file: File): void {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
    if (this.uploadedFile === file) {
      this.uploadedFile = null;
    }
  }

  /* -------------- submit ------------------------------------ */
  onSubmit() {
    // Mark all main form controls as touched
    this.optionsForm.markAllAsTouched();
  
    // Mark all 'Other...' controls as touched (safely)
    Object.values(this.otherInputControls).forEach(ctrl => {
      if (ctrl && typeof ctrl.markAsTouched === 'function') {
        ctrl.markAsTouched();
      }
    });
  
    // Block submission if main form or any 'Other...' field is invalid
    const otherFieldsInvalid = Object.values(this.otherInputControls).some(ctrl => {
      return ctrl && typeof ctrl.invalid === 'boolean' && ctrl.invalid;
    });
  
    if (this.optionsForm.invalid || this.isSubmitting || otherFieldsInvalid) {
      alert('Please fill in all mandatory fields before submitting.');
      return;
    }
  
    this.isSubmitting = true;
  
    // Inject latest 'Other...' values into form
    Object.entries(this.otherInputControls).forEach(([qIdStr, ctrl]) => {
      const qId = +qIdStr;
      if (this.isOtherSelected[qId] && ctrl.value) {
        const control = this.optionsForm.get(qId.toString());
        if (control) {
          // Check if the control is a FormArray
          if (control instanceof FormArray) {
            // Replace 'Other...' value in the array
            const idx = control.controls.findIndex(c => c.value === 'Other...');
            if (idx !== -1) {
              control.at(idx).setValue(ctrl.value); 
            } else {
              control.push(this.fb.control(ctrl.value)); // just in case it's not added
            }
          } else {
            // For regular FormControl
            control.setValue(ctrl.value);
          }
        }
      }
    });
  
    // Extract and clean responses from form
    const responses = Object.entries(this.optionsForm.value)
      .filter(([_, v]) => v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
      .map(([qId, rawValue]) => {
        const questionId = +qId;
        let value = rawValue;
  
        // Replace 'Other...' in radio
        if (value === 'Other...' && this.otherInputControls[questionId]) {
          value = this.otherInputControls[questionId].value;
        }
  
        // Replace 'Other...' in checkbox group
        if (Array.isArray(value)) {
          if (value.includes('Other...') && this.otherInputControls[questionId]) {
            value = value.map((v: string) =>
              v === 'Other...' ? this.otherInputControls[questionId].value : v
            );
          }
        }
  
        return {
          question_id: questionId,
          response_value: Array.isArray(value) ? value.join(', ') : value
        };
      });
  
    // Prepare FormData
    const formDataToSend = new FormData();
    formDataToSend.append('form_data_str', JSON.stringify({
      form_id: this.formStructure.form_id,
      responses
    }));
  
    if (this.uploadedFiles.length > 0) {
      this.uploadedFiles.forEach((file) => {
        formDataToSend.append('files', file);
      });
    }
  
    // Call backend
    // this.consultantService.submitConsultantOptions(formDataToSend).subscribe({
    //   next: (response) => {
    //     console.log('Options submitted successfully:', response);
    //     this.router.navigate(['/consultant-form8']);
    //   },
    //   error: (err) => {
    //     console.error('Options submission failed:', err);
    //   },
    //   complete: () => {
    //     this.isSubmitting = false;
    //   }
    // });

    // For now, just navigate to the next form
    this.router.navigate(['/consultant-form8']);
    this.isSubmitting = false;
  }
}
