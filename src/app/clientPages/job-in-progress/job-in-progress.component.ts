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

@Component({
  selector: 'app-job-in-progress',
  standalone: true,
  templateUrl: './job-in-progress.component.html',
  styleUrls: ['./job-in-progress.component.css'],
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
export class JobInProgressComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['jobId', 'jobName', 'daysRemaining', 'actions'];

  constructor(private router: Router, private clientJobsService: ClientJobsService) {}

  ngOnInit() {
    console.log('Fetching jobs in progress...');
    this.clientJobsService.getJobsInProgress().subscribe({
      next: (response) => {
        console.log('Jobs in progress:', response.jobs);
        const jobs = response.jobs.map((job) => ({
          jobId: job.client_job_id,
          jobName: job.scope_of_service,
          expectedStartDate: job.expected_start_date,
          daysRemaining: this.calculateDaysRemaining(job.expected_start_date)
        }));
        this.dataSource.data = jobs;
      },
      error: (err) => {
        console.error('Error fetching jobs in progress:', err);
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

  handleAction(job: any) {
    this.router.navigate(['/client/job-progress-details'], { queryParams: { jobId: job.jobId } });
  }

  private calculateDaysRemaining(dateString: string): number {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  }
}
