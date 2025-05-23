import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { ClientJobsService } from '../../services/client-jobs.service';
import { catchError, map } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { LoadingComponent } from '../../components/loading/loading.component'; // adjust path if needed




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
    LoadingComponent
  ],
})
export class CompletedJobsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';
  isLoading = false;


  dataSource: MatTableDataSource<CompletedJob> = new MatTableDataSource<CompletedJob>();
  displayedColumns: string[] = ['jobName', 'consultant', 'budget', 'feedback'];
job: any;

  constructor(private router: Router, private clientJobsService: ClientJobsService) {}
  ngOnInit() {
    this.isLoading = true;
  
    this.clientJobsService.getCompletedJobs().subscribe({
      next: (response) => {
        const jobs: CompletedJob[] = response.jobs;
  
        const checkReviews$ = jobs.map(job =>
          this.clientJobsService.checkReviewExists(job.client_job_id, job.consultant_user_id).pipe(
            map(res => ({
              ...job,
              hasReview: res.reviewExists
            })),
            catchError(err => {
              console.error(`Failed to check review for job ${job.client_job_id}`, err);
              return of({
                ...job,
                hasReview: false
              });
            })
          )
        );
  
        forkJoin(checkReviews$).subscribe(updatedJobs => {
          this.dataSource.data = updatedJobs;
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Error fetching completed jobs:', err);
        this.isLoading = false;
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
    this.clientJobsService.checkReviewExists(job.client_job_id, job.consultant_user_id).subscribe({
      next: (res) => {
        if (res.reviewExists) {
          // If review already exists, open View/Edit mode
          this.router.navigate(['/client/feedback'], {
            queryParams: {
              jobId: job.client_job_id,
              consultantId: job.consultant_user_id,
              consultantName: job.consultant_company,
              scope: job.scope_of_service,
              mode: 'edit'
            }
          });
        } else {
          // If no review yet, open normal Give Feedback page
          this.router.navigate(['/client/feedback'], {
            queryParams: {
              jobId: job.client_job_id,
              consultantId: job.consultant_user_id,
              consultantName: job.consultant_company,
              scope: job.scope_of_service,
              mode: 'new'
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to check review status:', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }
  
  
  
  
  
  
}
