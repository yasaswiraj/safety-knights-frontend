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
  ) {}

  consultantName: string = '';
scope: string = '';

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.jobId = +params['jobId'];
    this.consultantId = +params['consultantId'];
    this.consultantName = params['consultantName'] || '';
    this.scope = params['scope'] || '';

    console.log('Job ID:', this.jobId);
    console.log('Consultant ID:', this.consultantId); 
  });
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
  
    console.log('Submitting feedback:', payload);
  
    this.clientJobsService.postReview(payload).subscribe({
      next: (res) => {
        alert('Feedback submitted successfully!');
  
        // ✅ Clear the fields
        this.feedbackText = '';
        this.consultantRating = 0;
        this.overallRating = 0;
  
        // ✅ Navigate to completed jobs page
        this.router.navigate(['/client/completed-jobs']);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert('Failed to submit review.');
      }
    });
  }

}
