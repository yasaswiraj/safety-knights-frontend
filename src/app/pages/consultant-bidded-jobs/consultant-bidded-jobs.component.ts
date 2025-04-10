import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { ConsultantJobBiddedService } from '../../services/consultant-job-bidded.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConsultantMatchesService } from '../../services/consultant-match.service';
import { MatDialog } from '@angular/material/dialog';
import { JobDetailDialogComponent } from '../job-detail-dialog/job-detail-dialog.component';
import { UpdateBidComponent } from '../update-bid/update-bid.component';

@Component({
  selector: 'app-consultant-bidded-jobs',
  standalone: true,
  templateUrl: './consultant-bidded-jobs.component.html',
  styleUrls: ['./consultant-bidded-jobs.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
})
export class ConsultantBiddedJobsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';

  displayedColumns: string[] = [
    'job_id',
    'location',
    'expected_start_date',
    'bid_amount',
    'actions'];

  // Removed duplicate declaration of dataSource
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  errorMessage: string | undefined;

  constructor(private consultantJobBiddedService: ConsultantJobBiddedService,
    private consultantMatchesService: ConsultantMatchesService,
    private dialog: MatDialog) {
   
  }

  ngOnInit() {
    this.fetchBiddedJobs();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchBiddedJobs() {
    this.consultantJobBiddedService.getBiddedJobs().subscribe(response => {
      console.log('Fetched bidded jobs:', response.pending_bids);
      this.dataSource.data = response.pending_bids;
    }, error => {
      console.error('Error fetching bidded jobs:', error);
    });
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
    viewBidDetail(job: any): void {
      console.log('View detail clicked for job:', job);
      const dialogRef = this.dialog.open(UpdateBidComponent, {
        width: '1000px',
        data: {
          jobid: job.job_id,  // Updated property name
          work_in_detail: job.work_in_detail || 'No description provided', // Fallback in case of undefined
          scope_of_service: job.scope_of_service || 'No scope provided', // Fallback in case of undefined,
          startDate : job.expected_start_date,
          deadline: job.proposal_deadline || 'No deadline provided', // Fallback in case of undefined
          location: job.project_location || 'No location provided', // Fallback in case of undefined 
        }
        
      });
}}
