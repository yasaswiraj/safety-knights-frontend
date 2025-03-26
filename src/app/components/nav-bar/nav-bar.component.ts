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

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  menuOpen = false;
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
    this.apiService.logoutUser().subscribe({
      next: (res: any) => {
        console.log('✅ Logout successful:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Logout failed:', err.error?.detail || err.message);
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
