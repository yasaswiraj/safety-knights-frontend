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
  comment: string = ''; // Optional: for any comments you might want to add
  users: User[] = []; // Explicitly type the users array
 
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<JobUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedStatus = this.data.job_status;
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
  

  getApiEndpoint(): string {
    const jobId = this.data.job_id;

    switch (this.selectedStatus) {
      case 'in_progress':
        return `${environment.apiUrl}/consultant/update_active_to_in_progress/${jobId}`;
      case 'closed':
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
        this.snackBar.open('Job status updated successfully!', 'Close', {
          duration: 5000, // Show for 5 seconds (or longer)
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(this.selectedStatus); // Close dialog after success
      },
      error => {
        console.error('Error updating job status:', error);
        this.snackBar.open('JFailed to update Job status', 'Close', {
          duration: 5000, // Show for 5 seconds (or longer)
          panelClass: ['snackbar-failure']
        });
      }
    );
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
  
}
