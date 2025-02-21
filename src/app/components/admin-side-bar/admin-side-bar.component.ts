import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-side-bar',
  imports: [],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent {
  menuItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'fas fa-home' },
    { label: 'All Users', route: '/admin/users-list', icon: 'fas fa-users' },
    { label: 'Matches', route: '/admin/matches-list', icon: 'fas fa-check' },
    { label: 'Bids', route: '/admin/bids-list', icon: 'fas fa-gavel' },
    { label: 'Inbox', route: '/admin/chat', icon: 'fas fa-envelope' },
    { label: 'Vetting', route: '/admin/vetting', icon: 'fas fa-heart' },
    { label: 'Site Settings', route: '/admin/site-settings', icon: 'fas fa-cog' },
  ];

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
