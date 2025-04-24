import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientJobsService, CompletedJob } from '../../services/client-jobs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from '../../components/loading/loading.component'; // adjust path as needed


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
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, LoadingComponent],
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
  isLoading = false;


  showReasonBox: { [jobId: number]: boolean } = {};
  rejectionReasons: { [jobId: number]: string } = {};

  constructor(private clientJobsService: ClientJobsService) { }

  ngOnInit() {
    this.fetchClosedJobs();
  }

  fetchClosedJobs() {
    this.isLoading = true;
  
    this.clientJobsService.getClosedJobs().subscribe({
      next: (response: { jobs: Job[] }) => {
        this.jobs = response.jobs.map((job) => ({
          ...job,
          jobName: job.scope_of_service || 'N/A',
          consultant: job.consultant_company || 'N/A',
          bid_amount: job.bid_amount ?? 0
        }));
  
        this.updateDataSource();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch closed jobs:', err);
        this.isLoading = false;
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
  
    this.clientJobsService.updateClosedJobToInProgress(jobId, reason).subscribe({
      next: () => {
        console.log(`Job ${jobId} moved to in-progress with comment:`, reason);
        this.showReasonBox[jobId] = false;
        this.rejectionReasons[jobId] = '';
        this.fetchClosedJobs(); // refresh list
      },
      error: (err) => {
        console.error('Failed to move job to in progress with comment:', err);
        alert('Failed to submit your reason. Please try again.');
      }
    });
  }

}
