import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  menuOpen = false;
  isLoading = false; // Add loading state
  @Output() toggleSidebar = new EventEmitter<void>();

  @ViewChild('menuWrapper') menuWrapper!: ElementRef;

  constructor(private router: Router, private http: HttpClient, private apiService: ApiService) { }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.isLoading = true; // Set loading state to true
    this.apiService.logoutUser().subscribe({
      next: (res: any) => {
        console.log('✅ Logout successful:', res);
        this.router.navigate(['/login']);
        this.isLoading = false; // Reset loading state
      },
      error: (err) => {
        console.error('❌ Logout failed:', err.error?.detail || err.message);
        this.isLoading = false; // Reset loading state
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.menuWrapper && !this.menuWrapper.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
