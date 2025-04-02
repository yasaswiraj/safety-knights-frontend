import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JobUpdateDialogComponent } from '../job-update-dialog/job-update-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ConsultantMatchesService } from '../../services/consultant-match.service';

interface Job {
  job_id: number;
  scope_of_service: string;
  project_location: string;
  expected_start_date: string;
  proposal_deadline: string;
  budget: number;
  days_remaining?: number; // Computed field
}

@Component({
  selector: 'app-consultant-active-jobs',
  standalone: true,
  templateUrl: './consultant-active-jobs.component.html',
  styleUrls: ['./consultant-active-jobs.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    FormsModule,
  ],
})
export class ConsultantActiveJobsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  

  displayedColumns: string[] = [
    'job_id',
    'scope_of_service',
    'project_location',
    'expected_start_date',
    'days_remaining',
    'budget',
    'actions'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  
  constructor(private consultantMatchesService: ConsultantMatchesService, private dialog: MatDialog) {
    // this.jobs.forEach(job => {
    //   job.days_remaining = this.calculateDaysRemaining(job.expected_start_date);
    // });
    // this.dataSource = new MatTableDataSource(this.jobs);
    // this.dataSource.filterPredicate = (data: any, filter: string) => {
    //   return Object.values(data).some(value => 
    //     typeof value === 'string' && value.toLowerCase().includes(filter) ||
    //     typeof value === 'number' && value.toString().includes(filter)
    //   );
    // };
    
  }

  ngOnInit() {
    this.fetchActiveJobs();
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  
  

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchActiveJobs() {
    this.consultantMatchesService.getActiveJobs().subscribe(response => {
      console.log('Fetched matched jobs:', response.matched_jobs);
      this.dataSource.data = response.jobs_in_progress;
    }, error => {
      console.error('Error fetching matched jobs:', error);
    });
  }

  calculateDaysRemaining(startDate: string): number {
    const today = new Date();
    const start = new Date(startDate);
    const timeDiff = start.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
  }

  openEditDialog(job: Job): void {
    const dialogRef = this.dialog.open(JobUpdateDialogComponent, {
      width: '600px',
      data: { job_id: job.job_id,
              scope_of_service: job.scope_of_service, // Pass the necessary job fields to the dialog
              project_location: job.project_location, // Pass the necessary job fields to the dialog
              
       }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.jobId) {
    //     console.log(`Removing job with ID: ${result.jobId}`);
  
    //     // Remove job from table
    //     this.dataSource.data = this.dataSource.data.filter(j => j.job_id !== result.jobId);
    //   }
    // });
  }

  // editJob(job: Job): void {
  //   this.editingJob = { ...job };
  // }

  // updateJob(updatedJob: Job): void {
  //   const index = this.jobs.findIndex(j => j.job_id === updatedJob.job_id);
  //   if (index !== -1) {
  //     this.jobs[index] = updatedJob;
  //     this.jobs[index].days_remaining = this.calculateDaysRemaining(updatedJob.expected_start_date);
  //     this.dataSource.data = [...this.jobs];
  //   }
  //   this.editingJob = null;
  // }
}
