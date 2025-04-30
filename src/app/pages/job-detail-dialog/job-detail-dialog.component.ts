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
import { Router } from '@angular/router';
import { ConsultantMatchesService } from '../../services/consultant-match.service';

// Define an interface for user data
interface User {
  client_id: any;
  name: string;


}


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
    
  ],
  styleUrls: ['./job-detail-dialog.component.css']
})
export class JobDetailDialogComponent {
// Removed duplicate objectKeys method
  bidAmount!: number;
  availability!: string;
startDate: any;
 
users: User[] = []; // Explicitly type the users array
  constructor(
    public dialogRef: MatDialogRef<JobDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private consultantMatchesService: ConsultantMatchesService
  ) {
 
  }

  jobDetails: any;
  loading = true;
  errorMessage: string | undefined;
  objectKeys = Object.keys;


  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.fetchJobDetails(this.data.jobid);
    if (this.data.budget && !this.bidAmount) {
      this.bidAmount = this.data.budget; // pre-fill from data
    }
  }

  fetchJobDetails(jobId: string) {
    this.consultantMatchesService.getJobDetail(jobId).subscribe({
      next: (response) => {
        console.log('Fetched job details:', response);
        this.jobDetails = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching job details:', error);
        this.errorMessage = 'Failed to load job details.';
        this.loading = false;
      }
    });
  }

   getUserDetailsByJobId(jobId: number): void {
        this.http.get<any>(`${environment.apiUrl}/consultant/jobs/${jobId}`, { withCredentials: true }).subscribe({
          next: (response) => {
            console.log('User details fetched:', response.client);
             // Call message function with fetched user
    
             // Close dialog first
          this.dialogRef.close();
    
          // Then navigate (with a slight delay to ensure dialog cleanup if needed)
          setTimeout(() => {
            this.messageClient(response.client);
          }, 0);
          },
          error: (error) => {
            console.error('Failed to fetch user details:', error);
            this.snackBar.open('Failed to fetch user details.', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    
      messageClient(user: User): void {
        // Convert user to chat object and navigate
        console.log('User for chat:', user);
        const chat = {
          id: user.client_id,
          user: {
            name: user.name,
            avatar: this.getRandomAvatar(user.client_id ?? 0),
          },
          lastMessage: '',
          time: this.formatTime(new Date().toISOString()),
          isOnline: false,
        };
        console.log('Chat object:', chat);
        this.router.navigate(['/consultant/consultant-inbox'], { state: { chatWith: chat } });
      }
    
      formatTime(isoTime: string): string {
        const date = new Date(isoTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    
      getRandomAvatar(seed: number): string {
        // Just for demo purposes — use a real avatar field if you have it
        return `https://randomuser.me/api/portraits/men/${seed % 100}.jpg`;
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
