import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // ✅ Required for Angular pipes
import { ClientJobsService } from '../../services/client-jobs.service';

interface CompletedJob {
  jobId: string;
  jobName: string;
  consultant: string;
}

@Component({
  selector: 'app-completed-jobs',
  standalone: true,
  templateUrl: './completed-jobs.component.html',
  styleUrls: ['./completed-jobs.component.css'],
  imports: [
    CommonModule,  // ✅ Enables pipes like currency, number, etc.
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class CompletedJobsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  // completedJobs: CompletedJob[] = [
  //   { jobId: '501', jobName: 'Network Security Audit', consultant: 'Michael Brown' },
  //   { jobId: '502', jobName: 'Software Compliance Review', consultant: 'Sarah Johnson' },
  //   { jobId: '503', jobName: 'Cloud Infrastructure Analysis', consultant: 'David Lee' },
  // ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['jobId', 'jobName', 'consultant', 'feedback'];

  constructor(private router: Router, private clientJobsService: ClientJobsService) {}

  ngOnInit() {
    console.log('Fetching completed jobs...');
    this.clientJobsService.getCompletedJobs().subscribe({
      next: (response) => {
        console.log('Completed Jobs:', response.jobs);
        const jobs = response.jobs.map((job, index) => ({
          jobId: job.client_job_id,
          jobName: job.scope_of_service,
          consultant: `Consultant ${index + 1}`  // 🔁 Mocked
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

  handleFeedback(job: CompletedJob) {
    this.router.navigate(['/client/share-feedback'], { queryParams: { jobId: job.jobId } });
  }
}
