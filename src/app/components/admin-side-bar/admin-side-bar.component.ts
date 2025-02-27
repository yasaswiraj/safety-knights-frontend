import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css',
})
export class AdminSideBarComponent {
  @Input() isSidebarOpen = true;
  activeLabel = signal<string>('Dashboard');

  isActive(label: string): boolean {
    return this.activeLabel() === label;
  }

  setActiveLabel(label: string) {
    this.activeLabel.set(label);
  }

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
}
