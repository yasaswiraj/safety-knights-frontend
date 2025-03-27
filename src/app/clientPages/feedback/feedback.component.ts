import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Include FormsModule here
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  overallRating = 0;
  consultantRating = 0;
  feedbackText = '';

  setOverallRating(star: number) {
    this.overallRating = star;
  }

  setConsultantRating(star: number) {
    this.consultantRating = star;
  }

  submitFeedback() {
    console.log("✅ Feedback Submitted:", {
      overallRating: this.overallRating,
      consultantRating: this.consultantRating,
      feedbackText: this.feedbackText
    });
  }
}
