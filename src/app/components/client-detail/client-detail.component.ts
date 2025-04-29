import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent {
  @Input() clientDetails: any = null;
  @Output() closeExpansion = new EventEmitter<void>();

  closeDetail(): void {
    this.closeExpansion.emit();
  }
} 