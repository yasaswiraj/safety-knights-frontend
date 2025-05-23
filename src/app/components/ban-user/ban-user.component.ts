import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-ban-user',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './ban-user.component.html',
  styleUrl: './ban-user.component.css',
})
export class BanUserComponent {
  banReason = '';

  // Updated data interface to include a userId property
  constructor(
    public dialogRef: MatDialogRef<BanUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string, userId: number },
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.banReason.trim()) {
      this.adminService.banUser(this.data.userId, {ban_reason: this.banReason}).subscribe({
        next: (response) => {
          console.log('User banned successfully:', response);
          this.notificationService.showSuccess(`User ${this.data.userName} has been banned successfully.`);
          this.dialogRef.close({ confirmed: true, reason: this.banReason });
        },
        error: (error) => {
          console.error('Error banning user:', error);
          this.notificationService.showError('Failed to ban user. Please try again.');
        },
      });
    }
  }
}
