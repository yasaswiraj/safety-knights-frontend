import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute } from '@angular/router';
import { ClientJobsService } from '../../services/client-jobs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  overallRating = 0;
  // consultantRating = 0;
  feedbackText = '';
  jobId: number = 0;
  consultantId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private clientJobsService: ClientJobsService,
    private router: Router
  ) {
    // Check here, before the component initializes
    const params = this.route.snapshot.queryParams;
    this.jobId = +params['jobId'];
    
  }
  

  consultantName: string = '';
scope: string = '';

ngOnInit() {
  const params = this.route.snapshot.queryParams;

  this.jobId = +params['jobId'];
  this.consultantId = +params['consultantId'];
  this.consultantName = params['consultantName'] || '';
  this.scope = params['scope'] || '';

  const mode = params['mode']; // <-- important

  if (mode === 'edit') {
    // Fetch existing review and pre-fill fields
    this.clientJobsService.getReview(this.jobId, this.consultantId).subscribe({
      next: (res) => {
        this.feedbackText = res.review;
        // this.consultantRating = res.rating;
        this.overallRating = res.rating; 
      },
      error: (err) => {
        console.error('Failed to fetch existing review:', err);
        alert('Failed to load existing feedback.');
      }
    });
  }
}






  setOverallRating(star: number) {
    this.overallRating = star;
  }

  // setConsultantRating(star: number) {
  //   this.consultantRating = star;
  // }

  submitFeedback() {
    if (!this.jobId || !this.consultantId || !this.feedbackText || !this.overallRating || !this.overallRating) {
      alert('Please fill all fields and ensure consultant ID is provided.');
      return;
    }
  
    const payload = {
      job_id: this.jobId,
      consultant_user_id: this.consultantId,
      review: this.feedbackText,
      rating: this.overallRating
      // rating: this.consultantRating
    };
  
    const mode = this.route.snapshot.queryParams['mode'];
  
    if (mode === 'edit') {
      // Update review
      this.clientJobsService.getReview(this.jobId, this.consultantId).subscribe({
        next: (res) => {
          const reviewId = res.review_id;
          this.clientJobsService.updateReview(reviewId, payload).subscribe({
            next: () => {
              alert('Feedback updated successfully!');
              this.router.navigate(['/client/completed-jobs']);
            },
            error: (err) => {
              console.error('Error updating feedback:', err);
              alert(err.error?.detail || 'Failed to update feedback.');
            }
          });
        },
        error: (err) => {
          console.error('Failed to get review for update:', err);
        }
      });
    } else {
      // New review
      this.clientJobsService.postReview(payload).subscribe({
        next: () => {
          alert('Feedback submitted successfully!');
          const reviewedJobs = JSON.parse(localStorage.getItem('reviewedJobs') || '[]');
          if (!reviewedJobs.includes(this.jobId)) {
            reviewedJobs.push(this.jobId);
            localStorage.setItem('reviewedJobs', JSON.stringify(reviewedJobs));
          }
          this.router.navigate(['/client/completed-jobs']);
        },
        error: (err) => {
          console.error('Error submitting feedback:', err);
          alert(err.error?.detail || 'Failed to submit feedback.');
        }
      });
    }
  }
  

}
