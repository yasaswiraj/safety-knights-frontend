import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-received-bids',
  templateUrl: './client-received-bids.component.html',
  styleUrls: ['./client-received-bids.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule]
})
export class ClientReceivedBidsComponent {
  searchQuery = '';

  bids = [
    { id: 1, name: 'Consultant 1', rating: 5, reviews: 332, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1200 },
    { id: 2, name: 'Consultant 2', rating: 4, reviews: 290, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1399 },
    { id: 3, name: 'Consultant 3', rating: 3, reviews: 200, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1678 },
    { id: 4, name: 'Consultant 4', rating: 5, reviews: 410, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1738 },
    { id: 5, name: 'Consultant 5', rating: 4, reviews: 320, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1490 },
    { id: 6, name: 'Consultant 6', rating: 4, reviews: 280, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1500 }
  ];

  constructor(private router: Router) {}

  acceptBid(bidId: number) {
    console.log(`Bid ${bidId} accepted`);
    
    // ✅ Redirect to Client Agreement Page
    this.router.navigate(['/client/agreement'], { queryParams: { bidId } });
  }

  rejectBid(bidId: number) {
    console.log(`Bid ${bidId} rejected`);
    this.bids = this.bids.filter(bid => bid.id !== bidId); // Remove rejected bid from list
  }
}
