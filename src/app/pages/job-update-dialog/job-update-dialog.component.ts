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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConsultantMatchesService } from '../../services/consultant-match.service';

// Define an interface for user data
interface User {
  client_id: any;
  name: string;
  email: string;
  phone: string;

}

@Component({
  selector: 'app-job-update-dialog',
  templateUrl: './job-update-dialog.component.html',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule,ReactiveFormsModule,MatIconModule],
  styleUrls: ['./job-update-dialog.component.css']
})
export class JobUpdateDialogComponent {
  selectedStatus: string = '';
  currentStatus: string = ''; // To track the current status
  comment: string = ''; // Optional: for any comments you might want to add
  users: User[] = []; // Explicitly type the users array

  
  jobDetails: any;
  loading = true;
  errorMessage: string | undefined;
  objectKeys = Object.keys;
  regularComments: any[] = [];
 
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<JobUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private router: Router,
    private consultantMatchesService: ConsultantMatchesService
  ) {}

  ngOnInit(): void {
    
    console.log('Dialog data received:', this.data); // Add this
    this.selectedStatus = this.data.job_status;
    this.currentStatus = this.data.job_status; 
    console.log('JOB ID:', this.data.job_id); // Add this to check job_id
    this.fetchJobDetails(this.data.job_id);
    this.fetchCommentFromApi(this.data.job_id); // Initialize comment if available

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
  

fetchCommentFromApi(jobId: number) {
  this.http.get<any>(`${environment.apiUrl}/consultant/job_comments/${jobId}`, { withCredentials: true }).subscribe({
    next: (response) => {
      console.log('Fetched job comments:', response);

      // Show regular comments
      this.regularComments = response.regular_comments || [];

      // Get latest status change comment if exists
      if (response.status_change_comments?.length > 0) {
        const latestStatusComment = response.status_change_comments[response.status_change_comments.length - 1];
        this.comment = latestStatusComment.comment;
      } else {
        this.comment = ''; // default
      }
    },
    error: (error) => {
      console.error('Failed to fetch job comment:', error);
      this.snackBar.open('Failed to fetch job comment.', 'Close', {
        duration: 4000,
        panelClass: ['snackbar-error']
      });
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
  

  // getApiEndpoint(): string {
  //   const jobId = this.data.job_id;

  //   switch (this.selectedStatus) {
  //     case 'in_progress':
  //       return `${environment.apiUrl}/consultant/update_active_to_in_progress/${jobId}`;
  //     case 'closed':
  //       return `${environment.apiUrl}/consultant/update_in_progress_to_closed/${jobId}`;
  //     case 'active':
  //       return `${environment.apiUrl}/consultant/update_in_progress_to_active/${jobId}`;
  //     default:
  //       return ''; // If invalid status, return empty
  //   }
  // }

  getApiEndpoint(): string {
    const jobId = this.data.job_id;
    const currentStatus = this.currentStatus;
    const nextStatus = this.selectedStatus;
  
    const transitions = {
      'active_in_progress': `${environment.apiUrl}/consultant/update_active_to_in_progress/${jobId}`,
      'in_progress_active': `${environment.apiUrl}/consultant/update_in_progress_to_active/${jobId}`,
      'in_progress_closed': `${environment.apiUrl}/consultant/update_in_progress_to_closed/${jobId}`,
      'closed_in_progress': `${environment.apiUrl}/consultant/update_closed_to_in_progress/${jobId}`
    };
  
    const key = `${currentStatus}_${nextStatus}`;

  if (!transitions[key as keyof typeof transitions]) {
    // Invalid transition
    return '';
  }

  return transitions[key as keyof typeof transitions];
   
  }
  
 

  updateJobStatus() {
    const apiUrl = this.getApiEndpoint();
  
    if (!apiUrl) {
      this.snackBar.open(
        `Invalid status change from "${this.currentStatus}" to "${this.selectedStatus}".`,
        'Close',
        { duration: 5000, panelClass: ['snackbar-warning'] }
      );
      return;
    }
  
    const updatePayload = {
      job_id: this.data.job_id,
      status: this.selectedStatus, // The new status to update to
    };
  
    this.http.post(apiUrl, updatePayload, { withCredentials: true }).subscribe(
      response => {
        console.log('Job status updated:', response);
  
        // Now call the add-comment API
        const commentPayload = {
          comment: this.comment || `Status changed to ${this.selectedStatus}`, 
          // ^ you can collect a comment from user input or auto-generate one like this
        };
  
        this.http.post(`${environment.apiUrl}/consultant/job_status_change_comment/${this.data.job_id}`, commentPayload, { withCredentials: true }).subscribe(
          commentResponse => {
            console.log('Comment added successfully:', commentResponse);
            this.snackBar.open('Job status and comment updated successfully!', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-success']
            });
            this.dialogRef.close(this.selectedStatus); // Close the dialog after everything is done
          },
          commentError => {
            console.error('Error adding comment:', commentError);
            this.snackBar.open('Job status updated, but failed to add comment.', 'Close', {
              duration: 5000,
              panelClass: ['snackbar-warning']
            });
            this.dialogRef.close(this.selectedStatus); // Still close, but warn about comment
          }
        );
      },
      error => {
        console.error('Error updating job status:', error);
        this.snackBar.open('Failed to update job status.', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-failure']
        });
      }
    );
  }
  

  closeDialog() {
    this.dialogRef.close(false);
  }
  
}
