import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-job-update-dialog',
  templateUrl: './job-update-dialog.component.html',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule,ReactiveFormsModule,MatIconModule],
  styleUrls: ['./job-update-dialog.component.css']
})
export class JobUpdateDialogComponent {
  selectedStatus: string = '';
  comment: string = ''; // Optional: for any comments you might want to add
 
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<JobUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  

  getApiEndpoint(): string {
    const jobId = this.data.job_id;

    switch (this.selectedStatus) {
      case 'in_progress':
        return `${environment.apiUrl}/consultant/update_active_to_in_progress/${jobId}`;
      case 'completed':
        return `${environment.apiUrl}/consultant/update_in_progress_to_closed/${jobId}`;
      case 'waiting':
        return `${environment.apiUrl}/consultant/update_in_progress_to_active/${jobId}`;
      default:
        return ''; // If invalid status, return empty
    }
  }
 

  updateJobStatus() {
    const apiUrl = this.getApiEndpoint();

    if (!apiUrl) {
      alert('Please select a valid status.');
      return;
    }

    const updatePayload = {
      job_id: this.data.job_id,
      status: this.selectedStatus, // The new status to update to
    };

    this.http.post(apiUrl, updatePayload,{ withCredentials: true }).subscribe(
      response => {
        console.log('Job status updated:', response);
        alert('Job status updated successfully!');
        this.dialogRef.close(true); // Close dialog after success
      },
      error => {
        console.error('Error updating job status:', error);
        alert('Failed to update job status.');
      }
    );
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
  
}
