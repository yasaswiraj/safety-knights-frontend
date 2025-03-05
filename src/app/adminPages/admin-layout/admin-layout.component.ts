import { Component } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SideBarComponent, NavBarComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  menuItems = [
    { label: 'Dashboard', route: '/admin', icon: 'fas fa-home' },
    { label: 'All Users', route: '/admin/users-list', icon: 'fas fa-users' },
    { label: 'Matches', route: '/admin/matches-list', icon: 'fas fa-check' },
    { label: 'Bids', route: '/admin/bids-list', icon: 'fas fa-gavel' },
    { label: 'Inbox', route: '/admin/chat', icon: 'fas fa-envelope' },
    { label: 'Vetting', route: '/admin/vetting', icon: 'fas fa-circle-check' },
    {
      label: 'Site Settings',
      route: '/admin/site-settings',
      icon: 'fas fa-cog',
    },
  ];

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
