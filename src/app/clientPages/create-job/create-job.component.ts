import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormDataService } from '../../services/form-data.service';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-create-job',
  imports: [CommonModule],
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.css'
})
export class CreateJobComponent implements OnInit {
  formStructure: any;
  optionsCache: { [questionId: number]: Observable<string[]> } = {};

  constructor(
    public formDataService: FormDataService,
    public formsService: FormsService
  ) {}

  ngOnInit() {
    console.log('Create Job Component Initialized');
    this.formsService.getFormStructure(1).subscribe(
      (data) => {
        this.formStructure = data;
        console.log('Form structure received:', data);
      }
    );
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
}
