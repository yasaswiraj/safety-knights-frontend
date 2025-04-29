import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-unban-user',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  template: `
    <h2 mat-dialog-title class="text-xl font-semibold">Unban User</h2>
    <mat-dialog-content>
      <p class="text-gray-700">Are you sure you want to unban {{ data.userName }}?</p>
      <p class="text-sm text-gray-500 mt-2">
        {{ data.userType === 'Client' ? 'The user will be set to active status.' : 'The user will be set to vetting status.' }}
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="p-4">
      <button 
        mat-button 
        (click)="onCancel()"
        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        Cancel
      </button>
      <button 
        mat-button 
        color="primary" 
        (click)="onConfirm()"
        class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors ml-2">
        Unban
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
      min-width: 300px;
    }
    mat-dialog-content {
      margin: 20px 0;
      padding: 0 20px;
    }
    mat-dialog-actions {
      margin-bottom: 0;
      padding: 16px;
    }
  `]
})
export class UnbanUserComponent {
  constructor(
    public dialogRef: MatDialogRef<UnbanUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string, userId: number, userType: string },
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.adminService.unbanUser(this.data.userId).subscribe({
      next: (response) => {
        console.log('User unbanned successfully:', response);
        this.notificationService.showSuccess(`User ${this.data.userName} has been unbanned successfully.`);
        this.dialogRef.close({ confirmed: true });
      },
      error: (error) => {
        console.error('Error unbanning user:', error);
        this.notificationService.showError('Failed to unban user. Please try again.');
      },
    });
  }
} 