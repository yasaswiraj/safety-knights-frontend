import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // ✅ Import this for the number pipe

interface PendingBid {
  jobId: string;
  jobName: string;
  deadline: string;
  budget: number;
  action: string;
}

@Component({
  selector: 'app-pending-bids',
  standalone: true,
  templateUrl: './pending-bids.component.html',
  styleUrls: ['./pending-bids.component.css'],
  imports: [
    CommonModule,  // ✅ Added to enable Angular pipes like 'number'
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class PendingBidsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  pendingBids: PendingBid[] = [
    { jobId: '301', jobName: 'Quality Audit', deadline: '2025-03-20', budget: 5000, action: 'Edit' },
    { jobId: '302', jobName: 'Product Inspection', deadline: '2025-03-22', budget: 7500, action: 'Edit' },
    { jobId: '303', jobName: 'Safety Compliance', deadline: '2025-03-25', budget: 8200, action: 'Edit' },
  ];

  dataSource: MatTableDataSource<PendingBid>;
  displayedColumns: string[] = ['jobId', 'jobName', 'deadline', 'budget', 'actions'];

  constructor(private router: Router) {
    this.dataSource = new MatTableDataSource(this.pendingBids);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  handleAction(bid: PendingBid) {
    this.router.navigate(['/client/pending-bid-details'], { queryParams: { jobId: bid.jobId } });
  }
}
