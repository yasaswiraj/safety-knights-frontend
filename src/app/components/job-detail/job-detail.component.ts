import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent {
  @Input() jobDetails: any = null;
  @Output() closeExpansion = new EventEmitter<void>();
  isLoadingFiles = false;

  constructor(private adminService: AdminService) {}

  closeDetail(): void {
    this.closeExpansion.emit();
  }

  downloadFile(file: any): void {
    if (file.file_id) {
      this.isLoadingFiles = true;
      this.adminService.getFileById(file.file_id).subscribe({
        next: (blob: Blob) => {
          // Create a blob URL
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          
          // Get filename from file location or use default
          const filename = file.file_location.split('/').pop()?.split('_').pop() || 'document';
          link.download = filename;
          
          // Append to body, click, and cleanup
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.isLoadingFiles = false;
        },
        error: (error) => {
          console.error('Error downloading file:', error);
          this.isLoadingFiles = false;
        }
      });
    }
  }
} 