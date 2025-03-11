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

  dataSource: MatTableDataSource<PendingBid> = new MatTableDataSource<PendingBid>([]);  // ✅ Explicit Type Fix
  displayedColumns: string[] = ['jobId', 'jobName', 'deadline', 'budget', 'actions'];

  constructor(private router: Router, private clientJobsService: ClientJobsService) {}

  ngOnInit() {
    this.fetchPendingBids();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchPendingBids() {
    console.log('Fetching pending bids...');
    this.clientJobsService.getPendingBids().subscribe({
      next: (bids: PendingBid[]) => {
        this.dataSource.data = bids;
      },
      error: (err) => {
        console.error('Error fetching pending bids:', err);
      }
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  handleAction(bid: PendingBid) {
    this.router.navigate(['/client/pending-bid-details'], { queryParams: { jobId: bid.jobId } });
  }
}
