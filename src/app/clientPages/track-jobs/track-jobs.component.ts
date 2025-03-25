import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-track-jobs',
  templateUrl: './track-jobs.component.html',
  styleUrls: ['./track-jobs.component.css'],
  imports: [CommonModule, NgFor]
})
export class TrackJobsComponent {
  ongoingJobs = [
    { consultantId: 1, consultantName: 'Consultant A', jobTitle: 'Safety Inspection', daysLeft: 5, budget: 1200, startDate: 'March 18, 2025' },
    { consultantId: 2, consultantName: 'Consultant B', jobTitle: 'Equipment Audit', daysLeft: 10, budget: 2500, startDate: 'March 15, 2025' },
    { consultantId: 3, consultantName: 'Consultant C', jobTitle: 'Workplace Safety', daysLeft: 3, budget: 1500, startDate: 'March 20, 2025' }
  ];

  constructor(private router: Router) {}

  messageConsultant(consultantId: number) {
    // ✅ Navigate to chat page with consultant ID
    this.router.navigate(['/client/chat'], { queryParams: { consultantId } });
  }
}
