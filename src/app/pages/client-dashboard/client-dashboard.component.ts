import { Component } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Job {
  jobId: string;
  jobName: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    FormsModule,
  ],
})
export class ClientDashboardComponent {
  searchTerm = '';

  jobs: Job[] = [
    { jobId: '101', jobName: 'Auditing', status: 'Pending Bid', action: '' },
    { jobId: '102', jobName: 'Safety Test', status: 'Bidding In Process', action: '' },
    { jobId: '103', jobName: 'Development', status: 'Job In Progress', action: '' },
    { jobId: '104', jobName: 'Inspection', status: 'Completed', action: '' }
  ];

  filteredJobs: Job[] = [];

  displayedColumns: string[] = ['jobId', 'jobName', 'status', 'actions'];

  constructor(private router: Router) {
    this.filteredJobs = this.jobs.map(job => ({
      ...job,
      action: this.getActionLabel(job.status)  // Assign action dynamically
    }));
  }

  getActionLabel(status: string): string {
    switch (status) {
      case 'Pending Bid': return 'Edit';
      case 'Bidding In Process': return 'View';
      case 'Job In Progress': return 'Track';
      case 'Completed': return 'Share Feedback';
      default: return 'Action';
    }
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredJobs = this.jobs
      .filter(job => 
        job.jobId.toLowerCase().includes(term) || 
        job.jobName.toLowerCase().includes(term)
      )
      .map(job => ({
        ...job,
        action: this.getActionLabel(job.status)
      }));
  }

  navigateToClientForm3() {
    this.router.navigate(['/client-form-3']);
  }

  // ✅ Navigate to Home (Landing Page) when Logo is clicked
  navigateToLandingPage() {
    this.router.navigate(['/']);
  }


  handleAction(job: Job) {
    switch (job.status) {
      case 'Pending Bid':
        this.router.navigate(['/edit-job', job.jobId]);
        break;
      case 'Bidding In Process':
        this.router.navigate(['/view-job', job.jobId]);
        break;
      case 'Job In Progress':
        this.router.navigate(['/track-job', job.jobId]);
        break;
      case 'Completed':
        this.router.navigate(['/feedback', job.jobId]);
        break;
      default:
        console.log(`Unknown action for ${job.jobName}`);
    }
  }
}
