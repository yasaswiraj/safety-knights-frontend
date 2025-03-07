import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultant-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultant-profile.component.html',
  styleUrls: ['./consultant-profile.component.css']
})
export class ConsultantProfileComponent {
  constructor(
    public dialogRef: MatDialogRef<ConsultantProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  viewCertificates(): void {
    // Open the uploaded PDF in a new tab
    window.open('/assets/certificates/consultant1.pdf', '_blank');
  }
}
