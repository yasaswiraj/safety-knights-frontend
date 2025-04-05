import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service'; // Import AdminService

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
  }>; // Explicitly define the type

  displayedColumns: string[] = [
    'id',
    'clientName',
    'consultantName',
    'bid',
    'actions',
  ];

  constructor(private adminService: AdminService) {
    this.dataSource = new MatTableDataSource<{
      id: number;
      clientName: string;
      consultantName: string;
      bid: number;
    }>([]); // Explicitly define the type
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
          .filter((bid: any) => bid.bid_status === 'accepted') // Filter bids with status 'accepted'
          .map((bid: any) => ({
            id: bid.bid_id,
            clientName: `Client ${bid.client_user_id}`, // Replace with actual client name if available
            consultantName: `Consultant ${bid.consultant_user_id}`, // Replace with actual consultant name if available
            bid: bid.bid_amount,
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
}
