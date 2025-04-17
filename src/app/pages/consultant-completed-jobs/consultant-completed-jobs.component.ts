import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ClientFeedbackComponent } from '../client-feedback/client-feedback.component';
import { ConsultantMatchesService } from '../../services/consultant-match.service';

@Component({
  selector: 'app-consultant-matches',
  standalone: true,
  templateUrl: './consultant-completed-jobs.component.html',
  styleUrls: ['./consultant-completed-jobs.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class ConsultantCompletedJobsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns: string[] = [
    'job_id',
    'client_name',
    'client_id',
    'scope_of_service', // Ensure this matches your data structure
    'project_location',        // Adjust based on your actual data keys
    'completed_date', // Adjust based on your actual data keys, e.g., 'completed_date'
    'shareFeedback' // For the feedback button

  ];

  

  constructor(private consultantMatchesService: ConsultantMatchesService,
      private dialog: MatDialog) {
    
  }

  ngOnInit() {
    this.fetchCompletedJobs();  // Fetch on component load
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchCompletedJobs() {
    this.consultantMatchesService.getCompletedJobs().subscribe(response => {
      console.log('Fetched completed jobs:', response.completed_jobs);
      this.dataSource.data = response.completed_jobs;
    }, error => {
      console.error('Error fetching bidded jobs:', error);
    });
  }
 

  openFeedbackDialog(job: any) {
    console.log('View detail clicked for job:', job);
    const dialogRef = this.dialog.open(ClientFeedbackComponent, {
      width: '500px', // Adjust size as needed
      data: {
        job_id: job.job_id,
        client_user_id: job.client.client_id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Feedback submitted successfully');
      }
    });
  }
}

