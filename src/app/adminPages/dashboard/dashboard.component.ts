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
  totalMatchedJobs = 0;
  totalJobs = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    // Fetch total users
    this.adminService.getAllUsers().subscribe(
      (users) => {
        this.totalUsers = users.total;
        console.log('Total users:', this.totalUsers, users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

    // Fetch total bids using the new endpoint
    this.adminService.getTotalBids().subscribe(
      (response) => {
        this.totalBids = response.total_bids;
        console.log('Total bids:', this.totalBids);
      },
      (error) => {
        console.error('Error fetching total bids:', error);
        this.totalBids = 0;
      }
    );

    // Fetch total matched jobs using the new endpoint
    this.adminService.getTotalMatchedJobs().subscribe(
      (response) => {
        this.totalMatchedJobs = response.total_matched_jobs;
        console.log('Total matched jobs:', this.totalMatchedJobs);
      },
      (error) => {
        console.error('Error fetching total matched jobs:', error);
        this.totalMatchedJobs = 0;
      }
    );

    // Fetch total jobs using the new endpoint
    this.adminService.getTotalJobs().subscribe(
      (response) => {
        this.totalJobs = response.total_jobs;
        console.log('Total jobs:', this.totalJobs);
      },
      (error) => {
        console.error('Error fetching total jobs:', error);
        this.totalJobs = 0;
      }
    );
  }
}
