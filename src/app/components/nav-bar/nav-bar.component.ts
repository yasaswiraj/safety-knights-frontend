import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { LoadingComponent } from '../loading/loading.component';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, LoadingComponent, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  menuOpen = false;
  isLoading = false; // Add loading state
  isSidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  @ViewChild('menuWrapper') menuWrapper!: ElementRef;

  constructor(private router: Router, private http: HttpClient, private apiService: ApiService, private chatService: ChatService) { }

  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSidebar.emit();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.isLoading = true; // Set loading state to true
    this.apiService.logoutUser().subscribe({
      next: (res: any) => {
        console.log('Logout successful:', res);

        // Disconnect WebSocket connection on logout
        this.chatService.closeWebSocket();

        // Clear localStorage
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userType');

        this.router.navigate(['/login']);
        this.isLoading = false; // Reset loading state
      },
      error: (err) => {
        console.error('Logout failed:', err.error?.detail || err.message);
        this.isLoading = false; // Reset loading state
      }
    });
  }

  navigateToUpdateProfile() {
    const userType = localStorage.getItem('userType');
  
    if (userType === 'client') {
      this.router.navigate(['/client/update-profile']);
    } else if (userType === 'consultant') {
      this.router.navigate(['/consultant/update-profile']);
    } else {
      console.warn('Unknown user type, cannot navigate to update profile.');
    }
  }
  

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.menuWrapper && !this.menuWrapper.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  navigateToLandingPage() {
    this.router.navigate(['/']);
  }
}
