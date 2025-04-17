import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added for ngSwitch and common directives
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormsService } from '../../services/forms.service';

@Component({
  selector: 'app-update-job',
  imports: [CommonModule], // Added CommonModule to enable *ngSwitch and other common directives
  templateUrl: './update-job.component.html',
  styleUrl: './update-job.component.css'
})
export class UpdateJobComponent implements OnInit {
  formStructure: any;
  clientResponses: any;
  optionsCache: { [questionId: number]: Observable<string[]> } = {};

  constructor(private formsService: FormsService) { }

  ngOnInit(): void {
    // Fetch client detailed responses for a given client_response_id (e.g., 123)
    this.formsService.getClientResponsesDetailed(123).subscribe(
      data => {
        console.log('Client Responses Detailed in update component:', data);
        this.clientResponses = data;
      },
      error => {
        console.error('Error fetching client responses detailed:', error);
      }
    );
    // Fetch form structure for a given form_id (e.g., 1)
    this.formsService.getFormStructure(1).subscribe(
      data => {
        console.log('Form Structure in update component:', data);
        this.formStructure = data;
      },
      error => {
        console.error('Error fetching form structure:', error);
      }
    );
  }

  // Helper function to get options for a question id.
  getOptions(questionId: number): Observable<string[]> {
      if (!this.optionsCache[questionId]) {
        this.optionsCache[questionId] = this.formsService.getOptionsForQuestion(questionId).pipe(
          map((data: any) => data.options),
          tap(options => console.log(`Fetched options for question ${questionId}:`, options))
        );
      }
      return this.optionsCache[questionId];
    }

  // Helper to get prefilled response value by question id
  getResponse(questionId: number): any {
    if (!this.clientResponses || !this.clientResponses.categories) return '';
    for (const category of this.clientResponses.categories) {
      const response = category.responses.find((r: any) => r.question_id === questionId);
      if (response) return response.response_value;
    }
    return '';
  }
}
