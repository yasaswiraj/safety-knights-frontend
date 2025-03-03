import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/client-navbar/navbar.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent {
  pageTitle = ''; // ✅ Default title

  constructor(private router: Router, private route: ActivatedRoute) {
    // ✅ Update title dynamically based on the route
    this.router.events.subscribe(() => {
      this.setTitle();
    });
  }

  setTitle() {
    const routePath = this.router.url;
    if (routePath.includes('dashboard')) this.pageTitle = 'Dashboard';
    else if (routePath.includes('received-bids')) this.pageTitle = 'Received Bids';
    else this.pageTitle = ''; // Default (empty) for pages without a title
  }
}
