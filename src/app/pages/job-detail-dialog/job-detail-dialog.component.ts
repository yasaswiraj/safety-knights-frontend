import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Removed duplicate import of MatFormFieldModule
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-detail-dialog',
  templateUrl: './job-detail-dialog.component.html',
  standalone: true, 
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule,ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [
    MatNativeDateModule, // ✅ Correctly provides DateAdapter
  ],
  styleUrls: ['./job-detail-dialog.component.css']
})
export class JobDetailDialogComponent {
  bidAmount!: number;
  availability!: string;
startDate: any;
 

  constructor(
    public dialogRef: MatDialogRef<JobDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }


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

        this.snackBar.open('Your bid has been submitted successfully!', 'Close', {
          duration: 5000, // Show for 5 seconds (or longer)
          panelClass: ['snackbar-success']
        });
  
        // Close dialog and send jobId back
        this.dialogRef.close({ jobId });
      },
      error: (error) => {
        console.error('Error submitting bid:', error);
      }
    });
  }
  
}
