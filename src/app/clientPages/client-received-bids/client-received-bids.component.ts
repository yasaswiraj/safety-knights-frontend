import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { ConsultantProfileComponent } from '../consultant-profile/consultant-profile.component';
import { ConsultantReviewComponent } from '../consultant-review/consultant-review.component';

@Component({
  selector: 'app-client-received-bids',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './client-received-bids.component.html',
  styleUrls: ['./client-received-bids.component.css']
})
export class ClientReceivedBidsComponent {
  bids = [
    { 
      id: 1, 
      name: 'Consultant 1', 
      rating: 5, 
      reviews: 332, 
      jobId: 44352, 
      jobTitle: 'Safety Audits', 
      bidRate: 1200,
      age: 32,
      expertise: ['XYZ Certificate', 'Specialization in Safety', 'Profound skills', 'EHS safety officer'],
      workExperience: ['2 years at XYZ T company', '5 years as ABC official'],
      certifications: [
        'Certified Safety Professional (CSP) – BCSP',
        'Certified Industrial Hygienist (CIH) – AIHA',
        'Certified Safety and Health Manager (CSHM) – IHMM',
        'IOSH Level 3 Certificate – IOSH',
        'Certified Professional Ergonomist (CPE) – BCPE',
        'OSHA 30-Hour – OSHA'
      ],
      tools: [
        'EHS Software Experience (e.g., Enablon, Cority, Intelex)',
        'Incident Reporting & Data Analysis Skills',
        'Use of Digital Compliance & Safety Tracking Tools'
      ],
      reviewsList: [
        {
          reviewer: "Sarah W",
          rating: 4,
          title: "Exceptional Service and Expertise",
          text: "I had a fantastic experience using this platform!..."
        },
        {
          reviewer: "James R",
          rating: 5,
          title: "Highly Professional and Efficient",
          text: "The consultant I worked with was incredibly knowledgeable..."
        }
      ]
    },
    { id: 2, name: 'Consultant 2', rating: 4, reviews: 290, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1399 },
    { id: 3, name: 'Consultant 3', rating: 3, reviews: 200, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1678 },
    { id: 4, name: 'Consultant 4', rating: 5, reviews: 410, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1738 },
    { id: 5, name: 'Consultant 5', rating: 4, reviews: 320, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1490 },
    { id: 6, name: 'Consultant 6', rating: 4, reviews: 280, jobId: 44352, jobTitle: 'Safety Audits', bidRate: 1500 }
  ];

  constructor(private router: Router, private dialog: MatDialog) {}

  acceptBid(bidId: number) {
    console.log(`Bid ${bidId} accepted`);
    this.router.navigate(['/client/agreement'], { queryParams: { bidId } });
  }

  openConsultantProfile(bid: any) {
    this.dialog.open(ConsultantProfileComponent, {
      width: '50vw',
      maxWidth: '700px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'full-screen-dialog',
      data: {
        name: bid.name,
        rating: bid.rating,
        reviews: bid.reviews,
        age: bid.age || 'Not specified',
        expertise: bid.expertise || ['No expertise details available'],
        workExperience: bid.workExperience || ['No work experience available'],
        certifications: bid.certifications || ['No certifications available'],
        tools: bid.tools || ['No tools listed']
      }
    });
  }

  openConsultantReviews(bid: any) {
    this.dialog.open(ConsultantReviewComponent, {
      width: '50vw',
      maxWidth: '700px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'full-screen-dialog',
      data: {
        name: bid.name,
        rating: bid.rating,
        reviews: bid.reviews,
        reviewsList: bid.reviewsList || []
      }
    });
  }
}
