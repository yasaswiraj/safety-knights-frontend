import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, SideBarComponent, NavBarComponent, RouterModule],
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent {
  isSidebarOpen = true;
  pageTitle = '';

  // ✅ Updated Sidebar with "Create Job"
  menuItems: MenuItem[] = [
    { label: 'Create Job', route: '/client/form-3', icon: 'fa-solid fa-plus-circle' },
    { label: 'Bids in Process', route: '/client/bids-in-progress', icon: 'fa-solid fa-spinner' },
    { label: 'Pending Bids', route: '/client/pending-bids', icon: 'fa-solid fa-hourglass-half' },
    { label: 'Job in Progress', route: '/client/job-in-progress', icon: 'fa-solid fa-briefcase' },
    { label: 'Completed Jobs', route: '/client/completed-jobs', icon: 'fa-solid fa-check-circle' },
    { label: 'Inbox', route: '/client/inbox', icon: 'fa-solid fa-inbox' },
    { label: 'Profile', route: '/client/profile', icon: 'fa-solid fa-user' },

  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe(() => {
      this.setTitle();
    });
  }

  setTitle() {
    const routePath = this.router.url;
    if (routePath.includes('profile')) this.pageTitle = 'Profile';
    else if (routePath.includes('inbox')) this.pageTitle = 'Inbox';
    else if (routePath.includes('bids-in-process')) this.pageTitle = 'Bids in Process';
    else if (routePath.includes('pending-bid')) this.pageTitle = 'Pending Bid';
    else if (routePath.includes('job-in-process')) this.pageTitle = 'Job in Process';
    else if (routePath.includes('completed-jobs')) this.pageTitle = 'Completed Jobs';
    else if (routePath.includes('form-1')) this.pageTitle = 'Create Job'; // ✅ Set Title for "Create Job"
    else this.pageTitle = '';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
