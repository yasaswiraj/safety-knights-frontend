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
  job_status: any;
  work_in_detail: any;
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
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  
  constructor(private consultantMatchesService: ConsultantMatchesService, private dialog: MatDialog) {
  
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
      console.log('Fetched active jobs:', response.jobs_in_progress);
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
              work_in_detail: job.work_in_detail,
              proposal_deadline: job.proposal_deadline ,
              expected_start_date: job.expected_start_date,
              budget: job.budget ,
              job_status: job.job_status,
              
       }
    });

    
  }

}
