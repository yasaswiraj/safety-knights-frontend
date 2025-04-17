import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-consultant-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultant-profile.component.html',
  styleUrls: ['./consultant-profile.component.css']
})
export class ConsultantProfileComponent {
  certificates: any = null;
  certificateCategories: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<ConsultantProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  fetchCertificates(): void {
    const url = `${environment.apiUrl}/user/${this.data.user_id}/files`;
    console.log('Consultant ID for fetch:', this.data.user_id);
    this.http.get<any>(url, { withCredentials: true }).subscribe({
      next: (response) => {
        if (response.files_by_category) {
          this.certificates = response.files_by_category;
          this.certificateCategories = Object.keys(response.files_by_category);
        }
      },
      error: (err) => {
        console.error('Failed to fetch certificates:', err);
      }
    });
  }

  getFileUrl(fileId: number): string {
    return `${environment.apiUrl}/file/${fileId}`;
  }

  openFile(fileId: number) {
    const fileUrl = this.getFileUrl(fileId);
    window.open(fileUrl, '_blank');
  }

  getCategoryKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
