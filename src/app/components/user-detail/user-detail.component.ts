import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {
  @Input() userID: number | null = null;
  @Input() userDetails: any = null;
  @Output() closeExpansion = new EventEmitter<void>();

  closeDetail(): void {
    this.closeExpansion.emit();
  }
} 