import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // ✅ Required for Angular pipes
import { ClientJobsService } from '../../services/client-jobs.service';
import { catchError, map } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';



interface CompletedJob {
  client_job_id: number;
  scope_of_service: string;
  consultant_company: string;
  bid_amount: number;
  proposal_deadline: string;
  expected_start_date: string;
  consultant_user_id: number; 
  hasReview?: boolean;
}



@Component({
  selector: 'app-completed-jobs',
  standalone: true,
  templateUrl: './completed-jobs.component.html',
  styleUrls: ['./completed-jobs.component.css'],
  imports: [
    CommonModule,  
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class CompletedJobsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  dataSource: MatTableDataSource<CompletedJob> = new MatTableDataSource<CompletedJob>();
  displayedColumns: string[] = ['jobName', 'consultant', 'budget', 'feedback'];
job: any;

  constructor(private router: Router, private clientJobsService: ClientJobsService) {}

  ngOnInit() {
    this.clientJobsService.getCompletedJobs().subscribe({
      next: (response) => {
        const jobs: CompletedJob[] = response.jobs;
  
        const reviewChecks = jobs.map(job =>
          this.clientJobsService.hasReview(job.client_job_id).pipe(
            map(hasReview => ({ ...job, hasReview })), // <-- Make sure this is used
            catchError(() => of({ ...job, hasReview: false }))
          )
        );
  
        forkJoin(reviewChecks).subscribe((jobsWithReviewStatus: CompletedJob[]) => {
          this.dataSource.data = jobsWithReviewStatus;
        });
      },
      error: (err) => {
        console.error('Error fetching completed jobs:', err);
      }
    });
  }
  
  
  
  
  
  


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  handleFeedback(job: CompletedJob) {
    this.router.navigate(['/client/feedback'], {
      queryParams: {
        jobId: job.client_job_id,
        consultantId: job.consultant_user_id,
        consultantName: job.consultant_company,
        scope: job.scope_of_service
      }
    });
  }
  
}
