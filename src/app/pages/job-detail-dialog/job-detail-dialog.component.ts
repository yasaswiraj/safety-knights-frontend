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
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-job-detail-dialog',
  templateUrl: './job-detail-dialog.component.html',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule,ReactiveFormsModule],
  styleUrls: ['./job-detail-dialog.component.css']
})
export class JobDetailDialogComponent {
  bidAmount!: number;
  availability!: string;
 

  constructor(
    public dialogRef: MatDialogRef<JobDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  // onSubmit(): void {
  //   console.log('Bid Submitted:', { amount: this.bidAmount, availability: this.availability });
  //   this.jo
  //   this.dialogRef.close();
  // }
  onSubmit(): void {
    console.log(this.data);
    const jobId = this.data.jobid;  // Ensure correct job_id key
    console.log('Job ID:', jobId);
    console.log('Bid Amount:', this.bidAmount);
    const bidData = { "bid_amount" : this.bidAmount };
  
    console.log(`Submitting Bid for Job ID ${jobId}:`, bidData);
  
    this.http.post(`${environment.apiUrl}/consultant/${jobId}/place_bid`, bidData,{ withCredentials: true }).subscribe({
      next: (response) => {
        console.log('Bid submitted successfully:', response);
  
        // Close dialog and send jobId back
        this.dialogRef.close({ jobId });
      },
      error: (error) => {
        console.error('Error submitting bid:', error);
      }
    });
  }
  
}
