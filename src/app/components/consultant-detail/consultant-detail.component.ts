import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-consultant-detail',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './consultant-detail.component.html',
  styleUrls: ['./consultant-detail.component.css']
})
export class ConsultantDetailComponent {
  @Input() consultantDetails: any = null;
  @Output() closeExpansion = new EventEmitter<void>();

  closeDetail(): void {
    this.closeExpansion.emit();
  }
} 