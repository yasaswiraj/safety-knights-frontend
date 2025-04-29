import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../services/admin.service';
import { JobDetailComponent } from '../../components/job-detail/job-detail.component';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  templateUrl: './matches-list.component.html',
  styleUrls: ['./matches-list.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    FormsModule,
    MatProgressSpinnerModule,
    JobDetailComponent
  ],
})
export class MatchesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  searchQuery = '';
  dataSource: MatTableDataSource<{
    id: number;
    clientName: string;
    consultantName: string;
    bid: number;
    job_id: number;
  }>;
  expandedElement: any = null;
  jobDetails: any = null;
  loadingDetails = false;

  displayedColumns: string[] = [
    'id',
    'clientName',
    'consultantName',
    'bid',
    'actions'
  ];

  constructor(private adminService: AdminService) {
    this.dataSource = new MatTableDataSource<{
      id: number;
      clientName: string;
      consultantName: string;
      bid: number;
      job_id: number;
    }>([]);
  }

  ngOnInit() {
    this.fetchMatches();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchMatches() {
    this.adminService.getBids().subscribe(
      (data) => {
        this.dataSource.data = data
          .filter((bid: any) => bid.bid_status === 'accepted')
          .map((bid: any) => ({
            id: bid.bid_id,
            clientName: `Client ${bid.client_user_id}`,
            consultantName: `Consultant ${bid.consultant_user_id}`,
            bid: bid.bid_amount,
            job_id: bid.job_id
          }));
      },
      (error) => {
        console.error('Error fetching matches:', error);
      }
    );
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleRow(match: any) {
    if (this.expandedElement === match) {
      this.expandedElement = null;
      this.jobDetails = null;
      this.loadingDetails = false;
    } else {
      this.expandedElement = match;
      this.loadingDetails = true;
      
      // Fetch job details
      this.adminService.getJobDetails(match.job_id).subscribe(
        (data) => {
          this.jobDetails = data;
          this.loadingDetails = false;
        },
        (error) => {
          console.error('Error fetching job details:', error);
          this.loadingDetails = false;
        }
      );
    }
  }

  closeDetail(): void {
    this.expandedElement = null;
    this.jobDetails = null;
    this.loadingDetails = false;
  }
}
