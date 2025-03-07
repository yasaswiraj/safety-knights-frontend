import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() title = '';  // ✅ Accepts the heading as an input

  constructor(private router: Router) {}

  navigateToLandingPage() {
    this.router.navigate(['/']); // ✅ Navigates to home
  }
}
