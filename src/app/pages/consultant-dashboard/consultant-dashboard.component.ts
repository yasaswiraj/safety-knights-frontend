import { Component } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-consultant-dashboard',
  standalone: true,
  imports: [SideBarComponent, NavBarComponent, RouterOutlet],
  templateUrl: './consultant-dashboard.component.html',
  styleUrl: './consultant-dashboard.component.css',
})
export class ConsultantDashboardComponent {
  menuItems = [
    
    { label: 'Current Matches', route: '/consultant', icon: 'fas fa-users' },
    { label: 'Active Jobs', route: '/consultant-dashboard/consultant-matches', icon: 'fas fa-check' },
    { label: 'Bidded Jobs', route: '/admin/bids-list', icon: 'fas fa-gavel' },
    { label: 'Completed', route: '/admin/chat', icon: 'fas fa-envelope' },
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
