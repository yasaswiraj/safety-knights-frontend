import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { FormDataService } from '../../services/form-data.service'; 


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

  menuItems: MenuItem[] = [
    { label: 'Create Job', route: '/client/client-form', icon: 'fa-solid fa-plus-circle' },
    { label: 'Pending Bids', route: '/client/pending-bids', icon: 'fa-solid fa-hourglass-half' },
    { label: 'Bids in Process', route: '/client/bids-in-progress', icon: 'fa-solid fa-spinner' },
    { label: 'Job in Progress', route: '/client/job-in-progress', icon: 'fa-solid fa-briefcase' },
    { label: 'Verify Completion', route: '/client/verify-completion', icon: 'fa-solid fa-check-double' },
    { label: 'Completed Jobs', route: '/client/completed-jobs', icon: 'fa-solid fa-check-circle' },
    { label: 'Inbox', route: '/client/inbox', icon: 'fa-solid fa-inbox' },
    { label: 'Profile', route: '/client/profile', icon: 'fa-solid fa-user' },

  ];

  constructor(private router: Router, private route: ActivatedRoute, private formDataService: FormDataService) {
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
    else if (routePath.includes('verify-completion')) this.pageTitle = 'Verify Completion';
    else if (routePath.includes('completed-jobs')) this.pageTitle = 'Completed Jobs';
    else this.pageTitle = '';
  }

  handleMenuClick(item: MenuItem) {
    if (item.label === 'Create Job') {
      this.goToCreateJob();
    } else {
      this.router.navigate([item.route]);
    }
  }
  

  goToCreateJob() {
    this.formDataService.clearAll(); // Clear stale form state
    this.router.navigate(['/client/client-form']); // Navigate with clean form
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
