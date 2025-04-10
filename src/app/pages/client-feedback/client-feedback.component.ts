import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Removed duplicate import of MatFormFieldModule
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-job-detail-dialog',
  standalone: true,
  templateUrl: './client-feedback.component.html',
  styleUrls: ['./client-feedback.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ClientFeedbackComponent {
  overallRating: number = 0;
  consultantRating: number = 0;
  feedbackText: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { job_id: number; client_user_id: number },
    private http: HttpClient,
    private dialogRef: MatDialogRef<ClientFeedbackComponent>
  ) {}

  setOverallRating(star: number): void {
    this.overallRating = star;
  }

  setConsultantRating(star: number): void {
    this.consultantRating = star;
  }

  submitFeedback(): void {
    const payload = {
      job_id: this.data.job_id,
      client_user_id: this.data.client_user_id,
      rating: this.overallRating, // or this.consultantRating depending on your logic
      review_text: this.feedbackText
    };

     console.log('Submitting feedback:', payload);
    this.http.post(`${environment.apiUrl}/consultant/post_review`, payload,{ withCredentials: true }).subscribe({
      next: (res) => {
        console.log('Feedback submitted successfully', res);
        this.dialogRef.close(); // optionally close the dialog
      },
      error: (err) => {
        console.error('Error submitting feedback', err);
      }
    });
  }
}
