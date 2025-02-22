import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-nav-bar',
  imports: [],
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.css'
})
export class AdminNavBarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit(); 
  }
}