import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Import AdminService

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalBids = 0;
  currentMatches = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    // Fetch total users
    this.adminService.getAllUsers().subscribe(
      (users) => {
        this.totalUsers = users.users.length;
        console.log('Total users:', this.totalUsers, users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

    // Fetch total bids and accepted bids
    this.adminService.getBids(1, 1000).subscribe(
      (response) => {
        this.totalBids = response.total;
        this.currentMatches = response.items.filter((bid: any) => bid.bid_status === 'accepted').length;
      },
      (error) => {
        console.error('Error fetching bids:', error);
      }
    );
  }
}
