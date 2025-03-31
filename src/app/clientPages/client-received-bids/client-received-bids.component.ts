import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { ConsultantProfileComponent } from '../consultant-profile/consultant-profile.component';
import { ConsultantReviewComponent } from '../consultant-review/consultant-review.component';
import { ClientJobsService, BidInProgress } from '../../services/client-jobs.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-client-received-bids',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './client-received-bids.component.html',
  styleUrls: ['./client-received-bids.component.css']
})
export class ClientReceivedBidsComponent {
  bids: any[] = [];


  constructor(private router: Router, private dialog: MatDialog, private clientJobsService: ClientJobsService) {}

  ngOnInit() {
    this.clientJobsService.getBidsInProgress().subscribe({
      next: async (response) => {
        const rawBids: BidInProgress[] = response.jobs;
  
        // Group by job_id
        const jobMap: Map<number, any> = new Map();
  
        for (const bid of rawBids) {
          if (!jobMap.has(bid.client_job_id)) {
            jobMap.set(bid.client_job_id, {
              jobId: bid.client_job_id,
              jobTitle: bid.scope_of_service,
              deadline: bid.proposal_deadline,
              bids: []
            });
          }
  
          // Fetch consultant profile
          const consultant = await firstValueFrom(
            this.clientJobsService.getConsultantProfile(bid.consultant_user_id)
          );
  
          jobMap.get(bid.client_job_id).bids.push({
            bidAmount: bid.bid_amount,
            consultantId: consultant.user_id,
            consultantName: consultant.name,
            rating: consultant.statistics.average_rating,
            totalReviews: consultant.statistics.total_reviews
          });
        }
  
        this.bids = Array.from(jobMap.values());
        console.log("📦 Enriched Jobs with Bids:", this.bids);
      },
      error: (err) => {
        console.error('❌ Error fetching bids in progress:', err);
      }
    });
  }
  

  acceptBid(jobId: number, consultantId: number) {
    this.router.navigate(['/client/agreement'], {
      queryParams: {
        jobId,
        consultantId
      }
    });
  }
  

  openConsultantProfile(bid: any) {
    this.clientJobsService.getConsultantProfile(bid.consultantId).subscribe({
      next: (consultant) => {
  
        this.dialog.open(ConsultantProfileComponent, {
          width: '50vw',
          maxWidth: '700px',
          height: 'auto',
          maxHeight: '90vh',
          panelClass: 'full-screen-dialog',
          data: {
            name: consultant.name,
            rating: consultant.statistics.average_rating,
            reviews: consultant.statistics.total_reviews,
            company_name: consultant.company_name,
            company_address: consultant.company_address,
            contact: consultant.contact,
            job_title: consultant.job_title,
            email: consultant.email,
          }
        });
      },
      error: (err) => {
        console.error('❌ Error fetching consultant profile:', err);
      }
    });
  }
  

  openConsultantReviews(bid: any) {
    this.clientJobsService.getConsultantProfile(bid.consultantId).subscribe({
      next: (consultant) => {
        console.log('📝 Consultant reviews:', consultant.recent_reviews);
  
        this.dialog.open(ConsultantReviewComponent, {
          width: '50vw',
          maxWidth: '700px',
          height: 'auto',
          maxHeight: '90vh',
          panelClass: 'full-screen-dialog',
          data: {
            name: consultant.name,
            rating: consultant.statistics.average_rating,
            reviews: consultant.statistics.total_reviews,
            reviewsList: consultant.recent_reviews || []
          }
        });
      },
      error: (err) => {
        console.error('❌ Error fetching consultant reviews:', err);
      }
    });
  }
  
}

