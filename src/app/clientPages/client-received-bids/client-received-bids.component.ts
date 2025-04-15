import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  bids: {
    jobId: number;
    jobTitle: string;
    deadline: string;
    proposals: {
      bidAmount: number;
      consultantId: number;
      consultantName: string;
      rating: number;
      totalReviews: number;
    }[];
  }[] = [];
  
  jobId: number = 0;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private clientJobsService: ClientJobsService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.jobId = +params['jobId']; // Get jobId from URL

      if (!this.jobId) return;

      this.clientJobsService.getBidsInProgress().subscribe({
        next: async (response) => {
          const rawBids: BidInProgress[] = response.jobs;

          // Filter only bids for selected jobId
          const filteredBids = rawBids.filter(bid => bid.client_job_id === this.jobId);

          if (filteredBids.length === 0) {
            this.bids = [];
            return;
          }

          const job = {
            jobId: this.jobId,
            jobTitle: filteredBids[0].scope_of_service,
            deadline: filteredBids[0].proposal_deadline,
            proposals: [] as {
              bidAmount: number;
              consultantId: number;
              consultantName: string;
              rating: number;
              totalReviews: number;
            }[]
          };

          // Use Promise.all to fetch consultant profiles concurrently
          const consultantPromises = filteredBids.map(bid =>
            firstValueFrom(this.clientJobsService.getConsultantProfile(bid.consultant_user_id))
              .then(consultant => ({
                bidAmount: bid.bid_amount,
                consultantId: consultant.user_id,
                consultantName: consultant.name,
                rating: consultant.statistics.average_rating,
                totalReviews: consultant.statistics.total_reviews
              }))
          );

          job.proposals = await Promise.all(consultantPromises);

          this.bids = [job]; // Only one job group
        },
        error: (err) => {
          console.error('Error fetching bids:', err);
        }
      });
    });
  }
  

  acceptBid(jobId: number, consultantId: number) {
    this.clientJobsService.acceptBid(jobId, consultantId, { commitment: 'yes' }).subscribe({
      next: () => {
        this.router.navigate(['/client/bids-in-progress']);
      },
      error: (err) => {
        console.error('Failed to accept bid:', err);
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
        console.error(' Error fetching consultant profile:', err);
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

