import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-nav-bar',
  imports: [],
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.css'
})
export class AdminNavBarComponent {
  toggleSidebar() {
    console.log('Sidebar toggle button clicked');
  }
}