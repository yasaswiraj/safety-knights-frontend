import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientJobsService, CompletedJob } from '../../services/client-jobs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

interface Job extends CompletedJob {
  consultant?: string;
  jobName?: string;
  bid_amount: number;
}

@Component({
  selector: 'app-verify-completion',
  standalone: true,
  templateUrl: './verify-completion.component.html',
  styleUrls: ['./verify-completion.component.css'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule,]
})
export class VerifyCompletionComponent implements OnInit {
  applyFilter() {
    throw new Error('Method not implemented.');
  }
  dataSource: MatTableDataSource<Job> = new MatTableDataSource<Job>([]);
  displayedColumns: string[] = ['jobName', 'consultant', 'bidAmount', 'actions'];
  jobs: Job[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  showReasonBox: { [jobId: number]: boolean } = {};
  rejectionReasons: { [jobId: number]: string } = {};

  constructor(private clientJobsService: ClientJobsService) { }

  ngOnInit() {
    this.fetchClosedJobs();
  }

  fetchClosedJobs() {
    this.clientJobsService.getClosedJobs().subscribe({
      next: (response: { jobs: Job[] }) => {
        this.jobs = response.jobs.map((job) => ({
          ...job,
          jobName: job.scope_of_service || 'N/A',
          consultant: 'N/A',
          bid_amount: job.bid_amount ?? 0 // Ensure bid_amount is always a number
        }));

        // Update consultant names
        this.jobs.forEach((job) => {
          if (job.consultant_user_id) {
            this.clientJobsService.getConsultantProfile(job.consultant_user_id).subscribe({
              next: (profile: { company_name?: string; name?: string }) => {
                job.consultant = profile.company_name || profile.name || 'N/A';
                // Update dataSource after consultant name is fetched
                this.updateDataSource();
              },
              error: (err) => {
                console.error('Failed to fetch consultant profile:', err);
                this.updateDataSource();
              }
            });
          }
        });

        this.updateDataSource();
      },
      error: (err) => {
        console.error('Failed to fetch closed jobs:', err);
      }
    });
  }

  private updateDataSource() {
    this.dataSource.data = [...this.jobs];
  }

  markAsCompleted(jobId: number) {
    this.clientJobsService.updateClosedJobToCompleted(jobId).subscribe({
      next: () => {
        this.fetchClosedJobs(); // refresh list
      },
      error: (err) => {
        console.error('Failed to mark job as completed:', err);
      }
    });
  }

  submitRejection(jobId: number) {
    const reason = this.rejectionReasons[jobId]?.trim();
    if (!reason) {
      alert('Please provide a reason before submitting.');
      return;
    }
  
    // Here, call an API if needed or handle it internally
    console.log(`Job ${jobId} rejected for reason: ${reason}`);
  
    // Optionally hide the box again
    this.showReasonBox[jobId] = false;
  
    // Optionally send this reason to backend
    // this.clientJobsService.rejectJob(jobId, reason).subscribe(...);
  }
  

  moveToInProgress(jobId: number) {
    this.clientJobsService.updateClosedJobToInProgress(jobId).subscribe({
      next: () => {
        this.fetchClosedJobs(); // refresh list
      },
      error: (err) => {
        console.error('Failed to move job to in progress:', err);
      }
    });
  }
}
