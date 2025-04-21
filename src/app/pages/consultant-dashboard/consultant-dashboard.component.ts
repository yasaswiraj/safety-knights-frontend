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
    { label: 'Bidded Jobs', route: '/consultant/consultant-bidded', icon: 'fas fa-gavel' },
    { label: 'Active Jobs', route: '/consultant/consultant-active', icon: 'fas fa-check' },   
    { label: 'Completed', route: '/consultant/consultant-completed', icon: 'fas fa-envelope' },
    { label: 'Inbox', route: '/consultant/consultant-inbox', icon: 'fas fa-message' },
    { label: 'Update Profile', route: '/consultant/update-profile', icon: 'fas fa-edit' },
  
  ];

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
