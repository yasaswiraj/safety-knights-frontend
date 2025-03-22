import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // ✅ Required for pipes & Angular utilities

interface JobInProgress {
  jobId: string;
  jobName: string;
  consultant: string;
  daysRemaining: number;
  action: string;
}

@Component({
  selector: 'app-job-in-progress',
  standalone: true,
  templateUrl: './job-in-progress.component.html',
  styleUrls: ['./job-in-progress.component.css'],
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
export class JobInProgressComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  jobsInProgress: JobInProgress[] = [
    { jobId: '401', jobName: 'Cybersecurity Audit', consultant: 'John Doe', daysRemaining: 10, action: 'Track' },
    { jobId: '402', jobName: 'Infrastructure Testing', consultant: 'Jane Smith', daysRemaining: 15, action: 'Track' },
    { jobId: '403', jobName: 'Compliance Review', consultant: 'Alice Johnson', daysRemaining: 5, action: 'Track' },
  ];

  dataSource: MatTableDataSource<JobInProgress>;
  displayedColumns: string[] = ['jobId', 'jobName', 'consultant', 'daysRemaining', 'actions'];

  constructor(private router: Router) {
    this.dataSource = new MatTableDataSource(this.jobsInProgress);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  handleAction(job: JobInProgress) {
    this.router.navigate(['/client/job-progress-details'], { queryParams: { jobId: job.jobId } });
  }
}
