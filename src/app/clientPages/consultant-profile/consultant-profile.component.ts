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
  
  formatCategoryName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
  
  getFileUrl(fileId: number): string {
    return `${environment.apiUrl}/file/${fileId}`;
  }
  
  openFile(fileId: number) {
    const url = this.getFileUrl(fileId);
    window.open(url, '_blank');
  }
  
  

  getCategoryKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
