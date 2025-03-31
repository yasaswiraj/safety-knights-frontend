import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ban-user',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './ban-user.component.html',
  styleUrl: './ban-user.component.css',
})
export class BanUserComponent {
  banReason = '';

  constructor(
    public dialogRef: MatDialogRef<BanUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.banReason.trim()) {
      this.dialogRef.close({ confirmed: true, reason: this.banReason });
    }
  }
}
