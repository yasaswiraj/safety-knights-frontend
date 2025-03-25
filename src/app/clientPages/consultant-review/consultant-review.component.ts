import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultant-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultant-review.component.html',
  styleUrls: ['./consultant-review.component.css']
})
export class ConsultantReviewComponent {
  constructor(
    public dialogRef: MatDialogRef<ConsultantReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
