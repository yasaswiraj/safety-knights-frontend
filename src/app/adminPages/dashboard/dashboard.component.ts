import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent {
  totalUsers = 69325;
  totalBids = 45232;
  currentMatches = 45232;
}
