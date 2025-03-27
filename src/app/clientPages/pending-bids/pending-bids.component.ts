import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientJobsService, PendingBid } from '../../services/client-jobs.service';

@Component({
  selector: 'app-pending-bids',
  standalone: true,
  templateUrl: './pending-bids.component.html',
  styleUrls: ['./pending-bids.component.css'],
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
export class PendingBidsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  dataSource: MatTableDataSource<PendingBid> = new MatTableDataSource<PendingBid>([]);  
  displayedColumns: string[] = ['jobId', 'jobName', 'deadline', 'budget', 'actions'];

  constructor(private router: Router, private clientJobsService: ClientJobsService) { }

  ngOnInit() {
    this.fetchPendingBids();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchPendingBids() {
    console.log('Calling API...');
    // const userId = localStorage.getItem('user_id');
    // console.log('User ID:', userId);
    this.clientJobsService.getPendingBids().subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (!response || response.jobs.length === 0) {
          console.warn('No jobs returned. Possible missing cookie/session?');
        }
        const transformedJobs = response.jobs.map(job => ({
          ...job,
          jobId: job.client_job_id,
          jobName: job.scope_of_service,
          deadline: job.proposal_deadline,
          budget: job.budget,
        }));
  
        this.dataSource.data = transformedJobs;
      },
      error: (err) => {
        console.error('Error from API:', err);
      }
    });
  }



  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  handleAction(bid: PendingBid) {
    this.router.navigate(['/client/pending-bid'], { queryParams: { jobId: bid.client_job_id } });
  }
}
