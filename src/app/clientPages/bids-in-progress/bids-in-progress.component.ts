import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Bid, ClientService } from '../../services/client.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientJobsService, BidInProgress } from '../../services/client-jobs.service';

@Component({
  selector: 'app-bids-in-progress',
  templateUrl: './bids-in-progress.component.html',
  styleUrls: ['./bids-in-progress.component.css'],
  standalone: true,
  imports: [ MatTableModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule ]
})

export class BidsInProgressComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';
  dataSource: MatTableDataSource<Bid> = new MatTableDataSource<Bid>([]);
  displayedColumns: string[] = ['jobId', 'jobName', 'deadline', 'numBids', 'actions'];

  constructor(
    private router: Router,
    private clientJobsService: ClientJobsService
  ) {}

  ngOnInit() {
    this.clientJobsService.getBidsInProgress().subscribe({
      next: (response) => {
        const jobs = response.jobs.map((job: BidInProgress) => ({
          jobId: job.client_job_id,
          jobName: job.scope_of_service,
          deadline: job.proposal_deadline,
          numBids: job.bid_count
        }));
        this.dataSource.data = jobs;
        console.log('🔍 Jobs in progress:', jobs);
      },
      error: (err) => {
        console.error('❌ Error fetching bids in progress:', err);
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

  handleAction(bid: Bid) {
    this.router.navigate(['/client/received-bids'], {
      queryParams: { jobId: bid.jobId }
    });
  }
}

