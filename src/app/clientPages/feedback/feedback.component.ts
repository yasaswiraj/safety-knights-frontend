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
  consultantRating = 0;
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
    const reviewedJobs = JSON.parse(localStorage.getItem('reviewedJobs') || '[]');
  
    if (reviewedJobs.includes(this.jobId)) {
      this.router.navigate(['/client/completed-jobs']);
    }
  }
  

  consultantName: string = '';
scope: string = '';

ngOnInit() {
  const params = this.route.snapshot.queryParams;

  this.consultantId = +params['consultantId'];
  this.consultantName = params['consultantName'] || '';
  this.scope = params['scope'] || '';
}




  setOverallRating(star: number) {
    this.overallRating = star;
  }

  setConsultantRating(star: number) {
    this.consultantRating = star;
  }

  submitFeedback() {
    if (!this.jobId || !this.consultantId || !this.feedbackText || !this.consultantRating || !this.overallRating) {
      alert('Please fill all fields and ensure consultant ID is provided.');
      return;
    }
  
    const payload = {
      job_id: this.jobId,
      consultant_user_id: this.consultantId,
      review: this.feedbackText,
      rating: this.consultantRating,
      overallRating: this.overallRating
    };
  
    this.clientJobsService.postReview(payload).subscribe({
      next: (res) => {
        alert('Feedback submitted successfully!');
  
        const reviewedJobs = JSON.parse(localStorage.getItem('reviewedJobs') || '[]');
        if (!reviewedJobs.includes(this.jobId)) {
          reviewedJobs.push(this.jobId);
          localStorage.setItem('reviewedJobs', JSON.stringify(reviewedJobs));
        }
  
        this.feedbackText = '';
        this.consultantRating = 0;
        this.overallRating = 0;
  
        this.router.navigate(['/client/completed-jobs']);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert(err.error?.detail || 'Failed to submit review.');
      }
    });
  }
  

}
