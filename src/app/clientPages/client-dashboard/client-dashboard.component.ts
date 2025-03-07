import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Job {
  jobId: string;
  jobName: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css'],
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule, // ✅ Sorting Module Added
    FormsModule,
  ],
})
export class ClientDashboardComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  jobs: Job[] = [
    { jobId: '101', jobName: 'Auditing', status: 'Pending Bid', action: '' },
    { jobId: '102', jobName: 'Safety Test', status: 'Bidding In Process', action: '' },
    { jobId: '103', jobName: 'Development', status: 'Job In Progress', action: '' },
    { jobId: '104', jobName: 'Inspection', status: 'Completed', action: '' }
  ];

  dataSource: MatTableDataSource<Job>;

  displayedColumns: string[] = ['jobId', 'jobName', 'status', 'actions'];

  constructor(private router: Router) {
    this.dataSource = new MatTableDataSource(
      this.jobs.map(job => ({
        ...job,
        action: this.getActionLabel(job.status),
      }))
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getActionLabel(status: string): string {
    switch (status) {
      case 'Pending Bid': return 'Edit';
      case 'Bidding In Process': return 'View';
      case 'Job In Progress': return 'Track';
      case 'Completed': return 'Share Feedback';
      default: return 'Action';
    }
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  handleAction(job: Job) {
    switch (job.status) {
      case 'Pending Bid':
        this.router.navigate(['/edit-job', job.jobId]);
        break;
      case 'Bidding In Process':
        this.router.navigate(['/client/received-bids'], { queryParams: { jobId: job.jobId } });
        break;
      case 'Job In Progress':
        this.router.navigate(['/track-job', job.jobId]);
        break;
      case 'Completed':
        this.router.navigate(['/feedback', job.jobId]);
        break;
      default:
        console.log(`Unknown action for ${job.jobName}`);
    }
  }
}
