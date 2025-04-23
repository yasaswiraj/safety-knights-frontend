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
import { LoadingComponent } from '../../components/loading/loading.component';


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
    CommonModule,
    LoadingComponent]
})

export class BidsInProgressComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';
  dataSource: MatTableDataSource<Bid> = new MatTableDataSource<Bid>([]);
  displayedColumns: string[] = ['jobName', 'deadline', 'numBids', 'actions'];
  isLoading = false;


  constructor(
    private router: Router,
    private clientJobsService: ClientJobsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
  
    this.clientJobsService.getBidsInProgress().subscribe({
      next: (response) => {
        const groupedJobsMap = new Map<number, any>();
  
        response.jobs.forEach((job: any) => {
          const jobId = job.client_job_id;
  
          if (!groupedJobsMap.has(jobId)) {
            groupedJobsMap.set(jobId, {
              jobId: jobId,
              jobName: job.scope_of_service,
              deadline: job.proposal_deadline,
              numBids: 1
            });
          } else {
            const existing = groupedJobsMap.get(jobId);
            existing.numBids += 1;
          }
        });
  
        this.dataSource.data = Array.from(groupedJobsMap.values());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching bids in progress:', err);
        this.isLoading = false;
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

