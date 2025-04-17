import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { JobDetailDialogComponent } from '../job-detail-dialog/job-detail-dialog.component';
import { ConsultantMatchesService } from '../../services/consultant-match.service';

@Component({
  selector: 'app-consultant-matches',
  standalone: true,
  templateUrl: './consultant-matches.component.html',
  styleUrls: ['./consultant-matches.component.css'],
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
export class ConsultantMatchesComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'job_id',
    'budget',
    'project_location',
    'expected_start_date',
    'actions'
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  errorMessage: string | undefined;

  constructor(
    private consultantMatchesService: ConsultantMatchesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchConsultantMatches();  // Fetch on component load
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


fetchConsultantMatches() {
  this.consultantMatchesService.getConsultantMatches().subscribe(response => {
    console.log('Fetched matched jobs:', response.matched_jobs);
    this.dataSource.data = response.matched_jobs;
  }, error => {
    console.error('Error fetching matched jobs:', error);
  });
}


  viewDetail(job: any): void {
    console.log('View detail clicked for job:', job);
    const dialogRef = this.dialog.open(JobDetailDialogComponent, {
      width: '1000px',
      data: {
        jobid: job.job_id,  // Updated property name
        work_in_detail: job.work_in_detail || 'No description provided', // Fallback in case of undefined
        scope_of_service: job.scope_of_service || 'No scope provided', // Fallback in case of undefined,
        startDate : job.expected_start_date,
        deadline: job.proposal_deadline || 'No deadline provided', // Fallback in case of undefined
        location: job.project_location || 'No location provided', // Fallback in case of undefined 
        budget: job.budget || 'No budget provided', // Fallback in case of undefined
        name : job.client_name || 'No company name provided', // Fallback in case of undefined
        // average_rating : job.client.average_rating || 'No rating provided', // Fallback in case of undefined
      }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.jobId) {
        console.log(`Removing job with ID: ${result.jobId}`);
  
        // Remove job from table
        this.dataSource.data = this.dataSource.data.filter(j => j.job_id !== result.jobId);
      }
    });
  }
}
