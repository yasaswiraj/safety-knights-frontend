// import { Component, ViewChild, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { MatInputModule } from '@angular/material/input';
// import { MatSortModule, MatSort } from '@angular/material/sort';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-consultant-matches',
//   standalone: true,
//   templateUrl: './consultant-bidded-jobs.component.html',
//   styleUrls: ['./consultant-bidded-jobs.component.css'],
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatInputModule,
//     MatSortModule,
//     FormsModule,
//   ],
// })
// export class ConsultantBiddedJobs implements AfterViewInit {
//   @ViewChild(MatSort) sort!: MatSort;
//   searchQuery: string = '';
//   dataSource: MatTableDataSource<any>;

//   displayedColumns: string[] = [
//     'jobid',
//     'jobname',
//     'client',
//     'bidamount',
//     'deadline',
//     'daysremaining'
//   ];

//   jobs = [
//     {
//       jobid: 'J34232',
//       jobname: 'Software Engineer',
//       client: 'Google',
//       bidamount: 12000,
//       deadline: '2025-03-15',
//     },
//     {
//       jobid: 'J64362',
//       jobname: 'Data Scientist',
//       client: 'Facebook',
//       bidamount: 15000,
//       deadline: '2025-03-10',
//     },
//     {
//       jobid: 'J43212',
//       jobname: 'ML Engineer',
//       client: 'Amazon',
//       bidamount: 14000,
//       deadline: '2025-03-18',
//     },
//     {
//       jobid: 'J93242',
//       jobname: 'Cloud Architect',
//       client: 'Microsoft',
//       bidamount: 18000,
//       deadline: '2025-03-20',
//     },
//     {
//       jobid: 'J53221',
//       jobname: 'Backend Developer',
//       client: 'Netflix',
//       bidamount: 13500,
//       deadline: '2025-03-12',
//     },
//     {
//       jobid: 'J75339',
//       jobname: 'DevOps Engineer',
//       client: 'Spotify',
//       bidamount: 16000,
//       deadline: '2025-03-25',
//     },
//   ];

//   constructor() {
//     this.dataSource = new MatTableDataSource(this.jobs);
//   }

//   ngAfterViewInit() {
//     this.dataSource.sort = this.sort;
//   }

//   onSearch(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }

//   getDaysRemaining(deadline: string): number {
//     const today = new Date();
//     const deadlineDate = new Date(deadline);
//     const timeDiff = deadlineDate.getTime() - today.getTime();
//     return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
//   }
// }


import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { ConsultantJobBiddedService } from '../../services/consultant-job-bidded.service';

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
  ],
})
export class ConsultantBiddedJobsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery: string = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns: string[] = [
    'job_id',
    'scope_of_service',
    'location',
    'deadline',
    'expected_start',
    'bid_amount',
    'budget'
  ];

  // Removed duplicate declaration of dataSource

  constructor(private consultantJobBiddedService: ConsultantJobBiddedService) {
   
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
}
