import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Bid {
  jobId: string;
  jobName: string;
  deadline: string;
  numBids: number;
  action: string;
}

@Component({
  selector: 'app-bids-in-progress',
  standalone: true,
  templateUrl: './bids-in-progress.component.html',
  styleUrls: ['./bids-in-progress.component.css'],
  imports: [
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class BidsInProgressComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchTerm = '';

  bids: Bid[] = [
    { jobId: '201', jobName: 'Audit', deadline: '2025-03-10', numBids: 5, action: 'View' },
    { jobId: '202', jobName: 'Safety Test', deadline: '2025-03-12', numBids: 3, action: 'View' },
    { jobId: '203', jobName: 'Environment Safety', deadline: '2025-03-15', numBids: 7, action: 'View' },
  ];

  dataSource: MatTableDataSource<Bid>;
  displayedColumns: string[] = ['jobId', 'jobName', 'deadline', 'numBids', 'actions'];

  constructor(private router: Router) {
    this.dataSource = new MatTableDataSource(this.bids);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = term;
  }

  handleAction(bid: Bid) {
    this.router.navigate(['/client/received-bids'], { queryParams: { jobId: bid.jobId } });
  }
}
